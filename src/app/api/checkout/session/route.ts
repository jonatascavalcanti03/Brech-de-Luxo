import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

// ─────────────────────────────────────────────────────────
// GET /api/checkout/session?id=cs_xxx
// Retorna dados da session para a página de sucesso
// ─────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Pagamento ainda não confirmado" },
        { status: 402 }
      );
    }

    // Buscar o Order no banco para dados completos
    const order = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId },
      include: { product: true },
    });

    return NextResponse.json({
      customerName:  session.customer_details?.name ?? "Cliente",
      customerEmail: session.customer_details?.email ?? "",
      productTitle:  order?.product.title ?? session.line_items?.data[0]?.description ?? "",
      totalPrice:    (session.amount_total ?? 0) / 100,
      paymentMethod: session.payment_method_types?.[0]?.toUpperCase() ?? "CARD",
      orderId:       order?.id ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
