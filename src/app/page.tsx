import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCard } from "@/components/product/ProductCard";
import { Sparkles, ArrowRight, TrendingUp, Shield, Truck } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const VALUE_PROPS = [
  {
    icon: Shield,
    title: "Autenticidade Garantida",
    desc: "Cada peça passa por curadoria rigorosa. Certificado incluso.",
  },
  {
    icon: TrendingUp,
    title: "Peças de Alto Valor",
    desc: "Descontos reais em relação ao preço de varejo das marcas.",
  },
  {
    icon: Truck,
    title: "Entrega Premium",
    desc: "Embalagem exclusiva com nota fiscal e rastreamento completo.",
  },
];

export default async function HomePage() {
  // 1. Buscar produtos em destaque reais do banco
  const featuredProductsRaw = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    orderBy: { createdAt: "desc" }
  });

  // 2. Mapear para o formato do ProductCard
  const featuredProducts = featuredProductsRaw.map(p => {
    const media = p.mediaUrls as any;
    const imageUrl = Array.isArray(media) && media.length > 0 ? media[0].url : "";
    return {
      ...p,
      imageUrl,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    };
  });

  return (
    <>
      {/* ── Hero ── */}
      <HeroCarousel />

      {/* ── Value Props ── */}
      <section className="section-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VALUE_PROPS.map((vp) => (
            <div key={vp.title} className="glass-card p-5 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <vp.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{vp.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{vp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section-container py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400">
                Curadoria Exclusiva
              </span>
            </div>
            <h2 className="heading-luxury text-3xl sm:text-4xl">
              Peças em Destaque
            </h2>
            <p className="text-white/40 text-sm mt-2 max-w-md">
              Selecionadas a dedo. Cada peça conta uma história de estilo e sofisticação.
            </p>
          </div>
          <Link
            href="/vitrine"
            id="home-see-all"
            className="hidden sm:flex items-center gap-2 text-sm text-white/50 hover:text-emerald-400 transition-colors group"
          >
            Ver Tudo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="divider-gradient mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
          {featuredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center text-white/20 text-sm">
              Nenhuma peça em destaque no momento.
            </div>
          )}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/vitrine" id="home-see-all-mobile" className="btn-ghost">
            Ver Toda a Vitrine
          </Link>
        </div>
      </section>

      {/* ── Newsletter / CTA Section ── */}
      <section className="section-container py-20">
        <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px]"
              style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08), rgba(212,175,55,0.04))" }} />
          </div>

          <div className="relative z-10">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gradient-gold">
              Lista VIP
            </span>
            <h2 className="heading-luxury text-3xl sm:text-4xl mt-3 mb-4">
              Seja o Primeiro a Saber
            </h2>
            <p className="text-white/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Receba alertas de novas peças raras, quedas de preço e lançamentos exclusivos antes de qualquer pessoa.
            </p>
            <div className="flex items-center gap-3 max-w-sm mx-auto">
              <input
                type="email"
                id="newsletter-email"
                placeholder="seu@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none focus:ring-1 focus:ring-emerald/40"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <button id="newsletter-submit" className="btn-primary whitespace-nowrap">
                Entrar na VIP
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gradient" />
      <footer className="section-container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/25">
          © 2025 Luxé Brechó de Elite. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/sobre" className="text-xs text-white/25 hover:text-white/60 transition-colors">Sobre</Link>
          <Link href="/politicas" className="text-xs text-white/25 hover:text-white/60 transition-colors">Políticas</Link>
          <Link href="/contato" className="text-xs text-white/25 hover:text-white/60 transition-colors">Contato</Link>
        </div>
      </footer>
    </>
  );
}
