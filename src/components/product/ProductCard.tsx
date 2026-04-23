"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Heart,
  Eye,
  Flame,
  ShoppingBag,
  Share2,
  MessageCircle,
  Star,
  Zap,
} from "lucide-react";
import { clsx } from "clsx";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type ProductStatus = "AVAILABLE" | "RESERVED" | "SOLD";
export type Condition =
  | "NOVO_COM_ETIQUETA"
  | "SEMINOVO"
  | "OTIMO_ESTADO"
  | "BOM_ESTADO"
  | "VINTAGE";

export interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  brand?: string;
  category: string;
  size?: string;
  condition: Condition;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  hasVideo?: boolean;
  status: ProductStatus;
  views?: number;
  interested?: number;
  isFavorited?: boolean;
  featured?: boolean;
  onToggleFavorite?: (id: string) => void;
}

// ─────────────────────────────────────────────
// Condition Labels
// ─────────────────────────────────────────────
const CONDITION_LABELS: Record<Condition, string> = {
  NOVO_COM_ETIQUETA: "10/10 • Com Etiqueta",
  SEMINOVO:          "9/10 • Seminovo",
  OTIMO_ESTADO:      "8/10 • Ótimo Estado",
  BOM_ESTADO:        "7/10 • Bom Estado",
  VINTAGE:           "Vintage Autêntico",
};

// ─────────────────────────────────────────────
// Format currency (BRL)
// ─────────────────────────────────────────────
const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────
function StatusBadge({ status }: { status: ProductStatus }) {
  if (status === "SOLD") {
    return (
      <span className="badge-sold">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        Vendido
      </span>
    );
  }
  if (status === "RESERVED") {
    return (
      <span className="badge-reserved">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        Reservado
      </span>
    );
  }
  return (
    <span className="badge-available">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Disponível
    </span>
  );
}

// ─────────────────────────────────────────────
// WhatsApp Venda Assistida URL
// ─────────────────────────────────────────────
function buildWhatsAppUrl(product: ProductCardProps) {
  const msg = encodeURIComponent(
    `Olá! Tenho interesse na peça:\n\n` +
    `*${product.title}*\n` +
    `Marca: ${product.brand ?? "–"} | Tamanho: ${product.size ?? "–"}\n` +
    `Estado: ${CONDITION_LABELS[product.condition]}\n` +
    `Preço: ${formatBRL(product.price)}\n\n` +
    `🔗 https://seusite.com/p/${product.slug}`
  );
  return `https://wa.me/5500000000000?text=${msg}`;
}

// ─────────────────────────────────────────────
// ProductCard Component
// ─────────────────────────────────────────────
export function ProductCard(props: ProductCardProps) {
  const {
    id, slug, title, brand, size, condition, price, originalPrice,
    imageUrl, hasVideo, status, views, interested, isFavorited = false,
    featured = false, onToggleFavorite,
  } = props;

  const [favorited, setFavorited]     = useState(isFavorited);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── 3D Tilt Effect ──────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX  = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY  = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);
  const glareX   = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY   = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setShowActions(false);
  }, [mouseX, mouseY]);

  // Discount percentage
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const isAvailable = status === "AVAILABLE";

  return (
    <motion.div
      ref={cardRef}
      id={`product-card-${id}`}
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ z: 10 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setShowActions(true)}
      className={clsx(
        "group relative glass-card cursor-none select-none",
        featured && "ring-1 ring-rose-gold/30"
      )}
      data-cursor="pointer"
    >
      {/* ── Spotlight Glare Effect ── */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.06) 0%, transparent 60%)`,
        }}
      />

      {/* ── Image Container ── */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-[3/4]">
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}

        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={imageUrl}
            alt={`${title} – ${brand ?? "Brechó de Luxo"}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={clsx(
              "object-cover transition-opacity duration-500",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>

        {/* ── Dark overlay on hover ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* ── Top Badges ── */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
          <div className="flex flex-col gap-1.5">
            {/* Status */}
            <StatusBadge status={status} />

            {/* Featured */}
            {featured && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#d4af37",
                }}
              >
                <Star className="w-2.5 h-2.5 fill-current" />
                DESTAQUE
              </motion.span>
            )}

            {/* Discount */}
            {discount && discount > 0 && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  color: "#34d399",
                }}
              >
                <Zap className="w-2.5 h-2.5" />
                -{discount}%
              </span>
            )}
          </div>

          {/* Favorite button */}
          <motion.button
            id={`favorite-${id}`}
            aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            onClick={(e) => {
              e.preventDefault();
              setFavorited(!favorited);
              onToggleFavorite?.(id);
            }}
            className={clsx(
              "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200",
              favorited
                ? "bg-red-500/20 border border-red-500/30"
                : "bg-black/30 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20"
            )}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
          >
            <Heart
              className={clsx(
                "w-4 h-4 transition-all duration-200",
                favorited ? "fill-red-400 text-red-400" : "text-white/60"
              )}
            />
          </motion.button>
        </div>

        {/* ── Urgency Badge (bottom of image) ── */}
        {isAvailable && interested && interested > 2 && (
          <motion.div
            className="absolute bottom-3 left-3 z-10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="badge-urgency flex items-center gap-1.5">
              <Flame className="w-3 h-3 fill-red-400 text-red-400" />
              <span>{interested} pessoas interessadas</span>
            </span>
          </motion.div>
        )}

        {/* ── Quick Actions (appear on hover) ── */}
        <motion.div
          className="absolute bottom-3 right-3 flex flex-col gap-2 z-10"
          initial={false}
          animate={{ opacity: showActions ? 1 : 0, y: showActions ? 0 : 8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Views counter */}
          {views !== undefined && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-white/60"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
              <Eye className="w-3 h-3" />
              {views.toLocaleString("pt-BR")}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-4 flex flex-col gap-3">
        {/* Brand & Size */}
        <div className="flex items-center justify-between">
          {brand && (
            <span className="text-xs font-semibold tracking-widest uppercase text-gradient-gold">
              {brand}
            </span>
          )}
          {size && (
            <span
              className="text-xs px-2 py-0.5 rounded-md font-medium text-white/50"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {size}
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/p/${slug}`}
          id={`product-link-${id}`}
          className="block font-serif font-semibold text-base text-white leading-tight line-clamp-2 hover:text-emerald transition-colors duration-200"
        >
          {title}
        </Link>

        {/* Condition */}
        <span className="text-xs text-white/40">{CONDITION_LABELS[condition]}</span>

        {/* Price Row */}
        <div className="flex items-end justify-between gap-2 mt-1">
          <div>
            <p className="text-xl font-bold text-white leading-none">
              {formatBRL(price)}
            </p>
            {originalPrice && (
              <p className="text-xs text-white/30 line-through mt-0.5">
                {formatBRL(originalPrice)}
              </p>
            )}
          </div>

          {/* Video indicator */}
          {hasVideo && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-md font-medium text-white/50"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              ▶ Vídeo
            </span>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex gap-2 mt-1">
          {isAvailable ? (
            <>
              <Link
                href={`/p/${slug}`}
                id={`buy-${id}`}
                className="btn-primary flex-1 !py-2.5 !text-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Comprar
              </Link>
              <a
                href={buildWhatsAppUrl(props)}
                id={`whatsapp-${id}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contato via WhatsApp"
                className="btn-gold !py-2.5 !px-3"
                title="Venda Assistida via WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <motion.button
                id={`share-${id}`}
                aria-label="Compartilhar produto"
                className="btn-ghost !py-2.5 !px-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  navigator.share?.({ title, url: `/p/${slug}` })
                }
              >
                <Share2 className="w-3.5 h-3.5" />
              </motion.button>
            </>
          ) : (
            <button
              disabled
              className="flex-1 py-2.5 rounded-xl text-xs font-medium text-white/30 border border-white/5 cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {status === "SOLD" ? "Peça Vendida" : "Reservada"}
            </button>
          )}
        </div>
      </div>

      {/* ── Sold overlay ── */}
      {status === "SOLD" && (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center z-20"
          style={{ background: "rgba(5,5,5,0.7)", backdropFilter: "blur(2px)" }}>
          <div className="text-center">
            <p className="font-serif text-2xl font-bold text-white/80">VENDIDO</p>
            <p className="text-xs text-white/40 mt-1">Esta peça encontrou um novo lar ✨</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
