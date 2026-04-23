import { prisma } from "@/lib/prisma";
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Download,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { store: true }
  });

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white">Inventário de Peças</h1>
          <p className="text-sm text-white/40 mt-1">Gerencie seu acervo de ultra-luxo e acompanhe o status de cada item.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-medium text-white/60 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Exportar CSV
          </button>
          <Link href="/dashboard/inventory/new" className="btn-primary !py-2 !px-4 !text-xs">
            <Plus className="w-3.5 h-3.5" />
            Adicionar Peça
          </Link>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-[#0a0a0a] border border-white/5">
        <div className="flex items-center gap-1">
          <button className="px-4 py-2 rounded-xl bg-white/5 text-xs font-medium text-white border border-white/10">Todas</button>
          <button className="px-4 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/60 transition-all">Disponíveis</button>
          <button className="px-4 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/60 transition-all">Vendidas</button>
          <button className="px-4 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/60 transition-all">Reservadas</button>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-medium text-white/40 flex items-center gap-2 hover:text-white transition-all">
          <Filter className="w-3.5 h-3.5" />
          Filtros Avançados
        </button>
      </div>

      {/* ── Table ── */}
      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Produto</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Categoria</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Preço</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Interessados</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => {
                const media = product.mediaUrls as any;
                const imageUrl = Array.isArray(media) && media.length > 0 ? media[0].url : "";

                return (
                  <tr key={product.id} className="group hover:bg-white/[0.01] transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden relative border border-white/5">
                          {imageUrl ? (
                            <Image src={imageUrl} alt={product.title} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white/20">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">{product.title}</p>
                          <p className="text-[10px] text-white/30 uppercase tracking-tighter">{product.brand || "Sem marca"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-white/60">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        product.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-400" :
                        product.status === "SOLD" ? "bg-red-500/10 text-red-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          product.status === "AVAILABLE" ? "bg-emerald-400" :
                          product.status === "SOLD" ? "bg-red-400" :
                          "bg-amber-400"
                        }`} />
                        {product.status === "AVAILABLE" ? "Disponível" :
                         product.status === "SOLD" ? "Vendido" : "Reservado"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(product.price))}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60">{product.interested}</span>
                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500/40 rounded-full" 
                            style={{ width: `${Math.min((product.interested / 50) * 100, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <Link href={`/p/${product.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all" title="Ver na loja">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/inventory/edit/${product.id}`} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all" title="Editar">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-red-500/5 text-white/40 hover:text-red-400 transition-all" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-white/10 mb-4" />
            <p className="text-sm text-white/40">Seu inventário está vazio.</p>
            <Link href="/dashboard/inventory/new" className="text-xs text-emerald-400 hover:underline mt-2">Comece adicionando seu primeiro produto</Link>
          </div>
        )}

        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Mostrando {products.length} itens</p>
          <div className="flex items-center gap-2">
             <button className="p-2 text-xs text-white/40 hover:text-white disabled:opacity-30" disabled>&larr; Anterior</button>
             <button className="p-2 text-xs text-white/40 hover:text-white disabled:opacity-30" disabled>Próxima &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
