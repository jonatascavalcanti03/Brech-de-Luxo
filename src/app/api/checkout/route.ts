import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

// ─────────────────────────────────────────────────────────
// POST /api/checkout
// Cria uma Stripe Checkout Session para uma peça única
// Body: { productId: string, userId?: string }
// ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { productId, userId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId é obrigatório" },
        { status: 400 }
      );
    }

    // 1. Buscar o produto e verificar disponibilidade
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { store: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    if (product.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: `Esta peça não está mais disponível (status: ${product.status})` },
        { status: 409 }
      );
    }

    // 2. Reservar o produto imediatamente (previne race condition)
    await prisma.product.update({
      where: { id: productId },
      data: { status: "RESERVED" },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

    // 3. Criar Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "brl",

      // Linha de produto
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "brl",
            unit_amount: Math.round(Number(product.price) * 100), // R$ → centavos
            product_data: {
              name: product.title,
              description:
                `${product.brand ?? ""} | ${product.condition} | ${product.category}`.replace(
                  /^\s*\|\s*/,
                  ""
                ),
              images: (() => {
                try {
                  const media = product.mediaUrls as Array<{ url: string }>;
                  return media.slice(0, 1).map((m) => m.url);
                } catch {
                  return [];
                }
              })(),
              metadata: {
                productId: product.id,
                slug:      product.slug,
              },
            },
          },
        },
      ],

      // Métodos de pagamento BR
      payment_method_types: ["card", "boleto", "pix"],

      // Campos de coleta
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["BR"],
      },
      phone_number_collection: { enabled: true },

      // Metadados essenciais para o webhook
      metadata: {
        productId: product.id,
        storeId:   product.storeId,
        userId:    userId ?? "",
      },

      // URLs de retorno
      success_url: `${appUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/p/${product.slug}?cancelled=1`,

      // Expiração em 30 minutos (libera reserva via webhook expired)
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,

      // Dados do cliente (pré-preenche se logado)
      ...(userId && {
        client_reference_id: userId,
      }),

      // Configuração de boleto
      payment_method_options: {
        boleto: {
          expires_after_days: 3,
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    console.error("[Checkout API] Erro:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
