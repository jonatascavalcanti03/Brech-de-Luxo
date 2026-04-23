import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { BuyButton } from "@/components/product/BuyButton";
import { CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

export default async function ProductDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { slug } = await params;
  const { cancelled } = await searchParams;

  // 1. Busca o produto
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { store: true },
  });

  if (!product) {
    notFound();
  }

  // 2. Incrementar visualizações (Opcional/Fire and Forget)
  prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  // 3. Parse das mídias
  let media: { url: string; type: string }[] = [];
  try {
    const parsed = product.mediaUrls as any;
    if (Array.isArray(parsed)) media = parsed;
  } catch {}

  const mainImage = media[0]?.url || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&auto=format";

  // Desconto calculado
  const discount = product.originalPrice
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : null;

  const isAvailable = product.status === "AVAILABLE";
  const isCancelled = cancelled === "1";

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="section-container">
        
        {/* Aviso de Pagamento Cancelado */}
        {isCancelled && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4 text-amber-200">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">O pagamento não foi concluído</p>
              <p className="text-xs text-amber-200/60">A peça continuará reservada por alguns minutos até que o sistema libere para venda novamente.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* ── Galeria de Imagens ── */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-card">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Badge de status no topo da imagem */}
              {!isAvailable && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <p className="font-serif text-3xl font-bold text-white mb-2">
                      {product.status === "SOLD" ? "VENDIDO" : "RESERVADO"}
                    </p>
                    <p className="text-sm text-white/60">
                      Esta peça já tem um novo destino.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {media.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {media.slice(1, 5).map((m, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden glass-card opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                    <Image src={m.url} alt="Galeria" fill className="object-cover" sizes="25vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Informações do Produto ── */}
          <div className="flex flex-col">
            <div className="mb-6">
              {product.brand && (
                <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gradient-gold mb-2">
                  {product.brand}
                </h2>
              )}
              <h1 className="heading-luxury text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(product.price))}
                  </p>
                  {product.originalPrice && (
                    <p className="text-sm text-white/40 line-through mt-1">
                      Retail: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(product.originalPrice))}
                    </p>
                  )}
                </div>
                {discount && discount > 0 && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md text-xs font-bold mb-1">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            <div className="divider-gradient mb-6" />

            {/* Ações de Compra */}
            <div className="mb-10">
              {isAvailable ? (
                <div className="flex flex-col gap-3">
                  <BuyButton productId={product.id} productSlug={product.slug} className="w-full !py-4 !text-base" />
                  <p className="text-xs text-center text-white/40 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Compra segura via Stripe
                  </p>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-white/60 flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Peça indisponível no momento
                  </p>
                </div>
              )}
            </div>

            {/* Atributos / Especificações */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-4">
                <p className="text-xs text-white/40 mb-1">Estado de Conservação</p>
                <p className="text-sm font-medium text-white">{product.condition.replace(/_/g, " ")}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/40 mb-1">Tamanho / Medidas</p>
                <p className="text-sm font-medium text-white">{product.size || "Único"}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/40 mb-1">Categoria</p>
                <p className="text-sm font-medium text-white capitalize">{product.category.toLowerCase()}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/40 mb-1">Cor Primária</p>
                <p className="text-sm font-medium text-white capitalize">{product.color || "Não informado"}</p>
              </div>
            </div>

            {/* Descrição */}
            {product.description && (
              <div className="mb-8">
                <h3 className="font-serif text-xl text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Detalhes da Peça
                </h3>
                <div className="text-white/60 text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            )}

            {/* Garantias */}
            <div className="mt-auto space-y-3 bg-white/5 rounded-xl p-5 border border-white/5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Autenticidade Garantida</p>
                  <p className="text-xs text-white/40 mt-0.5">Todas as peças passam por rigorosa avaliação antes da venda.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Devolução Descomplicada</p>
                  <p className="text-xs text-white/40 mt-0.5">Você tem até 7 dias para solicitar a devolução, sem perguntas.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
