import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function CategoriasPage() {
  const categories = [
    { name: "Bolsas", slug: "bolsas", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format" },
    { name: "Sapatos", slug: "sapatos", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format" },
    { name: "Acessórios", slug: "acessorios", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format" },
    { name: "Vestuário", slug: "vestuario", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="section-container">
        
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400">
              Departamentos
            </span>
          </div>
          <h1 className="heading-luxury text-4xl sm:text-5xl">Categorias</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/vitrine?categoria=${cat.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-2xl glass-card">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${cat.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-black/80 transition-colors" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="font-serif text-2xl text-white font-bold group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-white/50 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                  Ver todas as peças &rarr;
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
