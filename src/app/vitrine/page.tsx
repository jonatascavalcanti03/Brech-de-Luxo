import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { SlidersHorizontal, Search } from "lucide-react";

export const revalidate = 60; // Revalida a página a cada 60s (ISR)

export default async function VitrinePage() {
  // Busca produtos no banco de dados (Apenas AVAILABLE ou RESERVED)
  const products = await prisma.product.findMany({
    where: {
      status: { in: ["AVAILABLE", "RESERVED"] },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="section-container">
        
        {/* ── Header da Vitrine ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="heading-luxury text-4xl sm:text-5xl mb-4">A Vitrine</h1>
            <p className="text-white/50 text-sm max-w-lg leading-relaxed">
              Explore nossa curadoria de peças exclusivas. Cada item é único, autenticado
              e selecionado para elevar sua jornada de estilo.
            </p>
          </div>
          
          {/* Controles de Filtro e Busca */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Buscar peças..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/50 transition-all"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
        </div>

        <div className="divider-gradient mb-12" />

        {/* ── Grid de Produtos ── */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              // Parse das mídias (JSON -> Array)
              let imageUrl = "";
              try {
                const media = product.mediaUrls as any;
                if (Array.isArray(media) && media.length > 0) {
                  imageUrl = media[0].url;
                }
              } catch (e) {}

              // Fallback para imagem vazia se não tiver
              if (!imageUrl) {
                imageUrl = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format"; // Mock
              }

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  title={product.title}
                  brand={product.brand || undefined}
                  category={product.category}
                  size={product.size || undefined}
                  condition={product.condition}
                  price={Number(product.price)}
                  originalPrice={product.originalPrice ? Number(product.originalPrice) : undefined}
                  imageUrl={imageUrl}
                  status={product.status}
                  views={product.views}
                  interested={product.interested}
                  featured={product.featured}
                />
              );
            })}
          </div>
        ) : (
          <div className="glass-card py-24 text-center flex flex-col items-center justify-center">
            <Search className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-xl font-serif text-white mb-2">Nenhuma peça disponível</h3>
            <p className="text-sm text-white/40 max-w-sm">
              Nossa curadoria está sendo atualizada. Volte em breve para descobrir novas jóias fashion.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
