import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────
// Stripe client (server-side only)
// ─────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

// ─────────────────────────────────────────────────────────
// POST /api/webhooks/stripe
// Handles Stripe events and syncs inventory atomically
// ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  // 1. Verificar assinatura do webhook
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Stripe Webhook] Signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature error: ${message}` },
      { status: 400 }
    );
  }

  console.log(`[Stripe Webhook] Event received: ${event.type} | ID: ${event.id}`);

  // 2. Processar eventos
  try {
    switch (event.type) {
      // ── Checkout completo (pagamento aprovado) ────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      // ── Pagamento confirmado (fallback para async payments) ──
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      // ── Pagamento expirado / falhou ───────────────────────
      case "checkout.session.expired":
      case "payment_intent.payment_failed": {
        const obj = event.data.object as
          | Stripe.Checkout.Session
          | Stripe.PaymentIntent;
        await handlePaymentFailed(obj, event.type);
        break;
      }

      // ── Estorno / reembolso ───────────────────────────────
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, eventId: event.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Stripe Webhook] Handler error for ${event.type}: ${message}`);
    return NextResponse.json(
      { error: "Internal webhook handler error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────
// HANDLER: checkout.session.completed
// Marca produto como SOLD e cria o Order no banco
// ─────────────────────────────────────────────────────────
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { metadata, id: stripeSessionId } = session;

  if (!metadata?.productId || !metadata?.storeId) {
    console.warn(
      `[Webhook] checkout.session.completed sem metadata obrigatório. Session: ${stripeSessionId}`
    );
    return;
  }

  const { productId, storeId, userId } = metadata;

  // Usar transação para garantir atomicidade (evitar double-sell)
  await prisma.$transaction(async (tx) => {
    // Verificar se o produto ainda está disponível
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: { id: true, status: true, price: true, title: true },
    });

    if (!product) {
      throw new Error(`Produto ${productId} não encontrado`);
    }

    if (product.status !== "AVAILABLE") {
      // Produto já foi vendido — iniciar reembolso automático
      console.error(
        `[Webhook] CONFLITO: Produto ${productId} já está ${product.status}. ` +
        `Solicitando reembolso para session ${stripeSessionId}`
      );

      if (session.payment_intent) {
        await stripe.refunds.create({
          payment_intent: session.payment_intent as string,
          reason: "duplicate",
        });
      }
      return;
    }

    // Determinar método de pagamento
    const paymentMethod = detectPaymentMethod(session.payment_method_types ?? []);

    // 1. Marcar produto como SOLD (bloqueio atômico)
    await tx.product.update({
      where: { id: productId },
      data: {
        status: "SOLD",
        soldAt: new Date(),
      },
    });

    // 2. Criar o Order vinculado ao Stripe session
    const customerDetails = session.customer_details;
    await tx.order.create({
      data: {
        storeId,
        productId,
        userId: userId ?? null,
        customerName:  customerDetails?.name  ?? "Cliente",
        customerEmail: customerDetails?.email ?? session.customer_email ?? "",
        customerPhone: customerDetails?.phone ?? null,
        totalPrice:    (session.amount_total ?? 0) / 100, // centavos → reais
        paymentMethod,
        status:        "PAID",
        stripeSessionId,
        stripePaymentIntent: session.payment_intent as string ?? null,
        paidAt: new Date(),
        shippingAddress: customerDetails?.address
          ? {
              logradouro: customerDetails.address.line1 ?? "",
              complemento: customerDetails.address.line2 ?? "",
              cidade:   customerDetails.address.city ?? "",
              uf:       customerDetails.address.state ?? "",
              cep:      customerDetails.address.postal_code ?? "",
              pais:     customerDetails.address.country ?? "BR",
            }
          : undefined,
      },
    });

    console.log(
      `[Webhook] ✅ Produto ${productId} marcado como SOLD. ` +
      `Order criado para session ${stripeSessionId}`
    );
  });
}

// ─────────────────────────────────────────────────────────
// HANDLER: payment_intent.succeeded
// Fallback para PIX e Boleto (pagamentos assíncronos)
// ─────────────────────────────────────────────────────────
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { metadata, id: paymentIntentId } = paymentIntent;

  if (!metadata?.productId) return;

  // Verificar se o Order já foi criado pelo checkout.session.completed
  const existingOrder = await prisma.order.findFirst({
    where: { stripePaymentIntent: paymentIntentId },
  });

  if (existingOrder) {
    // Só atualizar o status se ainda não estiver PAID
    if (existingOrder.status !== "PAID") {
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: { status: "PAID", paidAt: new Date() },
      });
      console.log(`[Webhook] Order ${existingOrder.id} atualizado para PAID`);
    }
    return;
  }

  console.log(
    `[Webhook] payment_intent.succeeded sem order correspondente: ${paymentIntentId}`
  );
}

// ─────────────────────────────────────────────────────────
// HANDLER: Pagamento falhou / expirou
// Libera o produto de volta para AVAILABLE
// ─────────────────────────────────────────────────────────
async function handlePaymentFailed(
  obj: Stripe.Checkout.Session | Stripe.PaymentIntent,
  eventType: string
) {
  const metadata = obj.metadata;
  if (!metadata?.productId) return;

  const { productId } = metadata;

  // Só liberar se estiver RESERVED (não desfazer SOLD)
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { status: true },
  });

  if (product?.status === "RESERVED") {
    await prisma.product.update({
      where: { id: productId },
      data: { status: "AVAILABLE" },
    });
    console.log(
      `[Webhook] Produto ${productId} liberado (${eventType})`
    );
  }
}

// ─────────────────────────────────────────────────────────
// HANDLER: charge.refunded
// Marca o Order como REFUNDED e libera o produto
// ─────────────────────────────────────────────────────────
async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;
  if (!paymentIntentId) return;

  const order = await prisma.order.findFirst({
    where: { stripePaymentIntent: paymentIntentId },
    include: { product: true },
  });

  if (!order) return;

  await prisma.$transaction([
    // Atualizar status do pedido
    prisma.order.update({
      where: { id: order.id },
      data: { status: "REFUNDED" },
    }),
    // Liberar o produto de volta ao catálogo
    prisma.product.update({
      where: { id: order.productId },
      data: { status: "AVAILABLE", soldAt: null },
    }),
  ]);

  console.log(
    `[Webhook] 🔄 Reembolso processado. Produto ${order.productId} disponível novamente.`
  );
}

// ─────────────────────────────────────────────────────────
// Utilitário: detectar método de pagamento
// ─────────────────────────────────────────────────────────
function detectPaymentMethod(
  types: string[]
): "CARD" | "PIX" | "BOLETO" {
  if (types.includes("boleto")) return "BOLETO";
  if (types.includes("pix"))    return "PIX";
  return "CARD";
}
