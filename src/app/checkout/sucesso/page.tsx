"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Home, Share2 } from "lucide-react";
import Link from "next/link";

// Componente de sucesso — busca os detalhes da session no Stripe
export default function CheckoutSucessoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderData, setOrderData] = useState<{
    customerName: string;
    productTitle: string;
    totalPrice: number;
    paymentMethod: string;
  } | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
      return;
    }

    // Buscar dados da session na API
    fetch(`/api/checkout/session?id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setStatus("error");
        } else {
          setOrderData(data);
          setStatus("success");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full skeleton" />
          <div className="w-48 h-4 skeleton rounded" />
          <div className="w-32 h-3 skeleton rounded" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center section-container">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <p className="text-white/60">Não foi possível carregar os dados do pedido.</p>
          <Link href="/" className="btn-primary mt-6 inline-flex">
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(16,185,129,0.08), transparent)",
        }}
      />

      <motion.div
        className="glass-card p-8 sm:p-12 max-w-lg w-full text-center relative"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Ícone de sucesso */}
        <motion.div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Eyebrow */}
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-3">
            Compra Confirmada
          </p>

          {/* Heading */}
          <h1 className="heading-luxury text-3xl sm:text-4xl mb-4">
            Parabéns, {orderData?.customerName?.split(" ")[0] ?? "você"}!
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Sua peça <span className="text-white font-medium">"{orderData?.productTitle}"</span> foi
            reservada com sucesso. Você receberá um e-mail com todos os detalhes.
          </p>

          {/* Order summary card */}
          <div
            className="rounded-xl p-4 mb-8 text-left space-y-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-white/40 flex-shrink-0" />
              <div>
                <p className="text-xs text-white/30">Peça</p>
                <p className="text-sm text-white font-medium">{orderData?.productTitle}</p>
              </div>
            </div>
            <div className="divider-gradient" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Total pago</span>
              <span className="text-sm font-bold text-white">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(orderData?.totalPrice ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Método</span>
              <span className="text-xs text-white/70 capitalize">
                {orderData?.paymentMethod?.toLowerCase() ?? "–"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" id="success-home" className="btn-ghost flex-1">
              <Home className="w-4 h-4" />
              Início
            </Link>
            <Link href="/vitrine" id="success-vitrine" className="btn-primary flex-1">
              Ver Mais Peças
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Share */}
          <button
            id="success-share"
            className="mt-4 flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors mx-auto"
            onClick={() =>
              navigator.share?.({
                title: "Acabei de encontrar uma peça incrível no Luxé!",
                url:   window.location.origin,
              })
            }
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartilhar
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
