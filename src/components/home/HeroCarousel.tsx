"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  brand: string;
  price: number;
  imageUrl: string;
  href: string;
  accentColor?: string;
}

// Demo slides (substitua por dados reais do DB)
const DEMO_SLIDES: HeroSlide[] = [
  {
    id: "1",
    title: "Bolsa Chanel Classic Flap",
    subtitle: "Peça icônica em couro caviar. Serial autenticado. 9/10.",
    brand: "CHANEL",
    price: 28900,
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format",
    href: "/p/chanel-classic-flap",
    accentColor: "#d4af37",
  },
  {
    id: "2",
    title: "Vestido Valentino Couture",
    subtitle: "Alta costura italiana. Bordado floral exclusivo. Novo com etiqueta.",
    brand: "VALENTINO",
    price: 15400,
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format",
    href: "/p/valentino-couture-dress",
    accentColor: "#e91e63",
  },
  {
    id: "3",
    title: "Relógio Rolex Datejust 36",
    subtitle: "Mostrador diamante. Pulseira Jubilee. Papers completos.",
    brand: "ROLEX",
    price: 72000,
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&auto=format",
    href: "/p/rolex-datejust-36",
    accentColor: "#10b981",
  },
];

const formatBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);

  const total = DEMO_SLIDES.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, current]);

  const slide = DEMO_SLIDES[current];

  return (
    <section
      id="hero-carousel"
      className="relative h-[90vh] min-h-[600px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background Image (Ken Burns) ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1,  scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── Ambient color glow from accent ── */}
      <motion.div
        key={`glow-${slide.id}`}
        className="absolute bottom-0 left-0 w-[50%] h-[40%] blur-[100px] opacity-20 pointer-events-none"
        style={{ background: slide.accentColor ?? "#10b981" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 section-container h-full flex flex-col justify-end pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${slide.id}`}
            className="max-w-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Brand tag */}
            <motion.span
              className="inline-block text-xs font-bold tracking-[0.35em] uppercase mb-4"
              style={{ color: slide.accentColor ?? "#10b981" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {slide.brand}
            </motion.span>

            {/* Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-6">
              {slide.subtitle}
            </p>

            {/* Price & CTA */}
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5">
                  Preço único
                </p>
                <p className="text-3xl font-bold text-white">
                  {formatBRL(slide.price)}
                </p>
              </div>

              <div className="flex gap-3">
                <Link href={slide.href} id={`hero-cta-${slide.id}`} className="btn-primary">
                  Ver Peça
                </Link>
                <Link href="/vitrine" id="hero-vitrine-cta" className="btn-ghost">
                  Ver Vitrine
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Progress Dots ── */}
        <div className="flex items-center gap-3 mt-12">
          {DEMO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              id={`hero-dot-${i}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === current ? 40 : 16, background: "rgba(255,255,255,0.2)" }}
            >
              {i === current && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: slide.accentColor ?? "#10b981" }}
                  layoutId="hero-dot-active"
                  transition={{ type: "spring", bounce: 0 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Arrow Controls ── */}
      <button
        id="hero-prev"
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-white/25 bg-black/30 hover:bg-black/50 text-white/60 hover:text-white transition-all backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        id="hero-next"
        onClick={next}
        aria-label="Próximo slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-white/25 bg-black/30 hover:bg-black/50 text-white/60 hover:text-white transition-all backdrop-blur-sm"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Slide counter ── */}
      <div className="absolute top-4 right-4 z-20 text-xs text-white/30 font-mono tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </section>
  );
}
