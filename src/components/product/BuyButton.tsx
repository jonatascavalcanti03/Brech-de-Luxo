"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2 } from "lucide-react";

interface BuyButtonProps {
  productId: string;
  productSlug: string;
  userId?: string;
  className?: string;
  disabled?: boolean;
}

// ─────────────────────────────────────────────────────────
// BuyButton — Inicia o fluxo de checkout Stripe
// Reserva a peça + redireciona para a Checkout Session
// ─────────────────────────────────────────────────────────
export function BuyButton({
  productId,
  userId,
  className = "",
  disabled = false,
}: BuyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    if (loading || disabled) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao iniciar o checkout");
        setLoading(false);
        return;
      }

      // Redirecionar para o Stripe Checkout
      if (data.url) {
        router.push(data.url);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        id={`buy-button-${productId}`}
        onClick={handleBuy}
        disabled={loading || disabled}
        className={`btn-primary ${className} ${loading || disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        aria-label="Comprar esta peça"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            Comprar Agora
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
