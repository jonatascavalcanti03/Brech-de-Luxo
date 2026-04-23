import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  Info,
  DollarSign,
  Image as ImageIcon,
  Check
} from "lucide-react";
import Link from "next/link";
import { createProduct } from "@/lib/actions/product";

export default async function NewProductPage() {
  const session = await auth();
  
  if (!session?.user) redirect("/auth/login");

  // Buscar lojas que o usuário gerencia (ou todas se for Super Admin)
  const stores = await prisma.store.findMany({
    where: session.user.role === "SUPER_ADMIN" ? {} : { id: session.user.storeId || "" }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory" className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-white">Nova Peça de Luxo</h1>
            <p className="text-sm text-white/40 mt-1">Preencha os detalhes para listar um novo item exclusivo.</p>
          </div>
        </div>
      </div>

      <form action={createProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Esquerda: Detalhes ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Informações Básicas */}
          <div className="glass-card p-8 border border-white/5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <Info className="w-4 h-4" /> Informações Gerais
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Título do Anúncio</label>
                <input 
                  name="title"
                  type="text" 
                  required
                  placeholder="Ex: Bolsa Chanel Classic Flap Média" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Marca</label>
                  <input 
                    name="brand"
                    type="text" 
                    placeholder="Ex: Chanel" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Categoria</label>
                  <select 
                    name="category"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  >
                    <option value="Bolsas">Bolsas</option>
                    <option value="Sapatos">Sapatos</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Relógios">Relógios</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Descrição Detalhada</label>
                <textarea 
                  name="description"
                  rows={6}
                  placeholder="Descreva a história, o estado de conservação e detalhes técnicos da peça..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Atributos Específicos */}
          <div className="glass-card p-8 border border-white/5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Atributos & Estado
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Tamanho / Medidas</label>
                <input 
                  name="size"
                  type="text" 
                  placeholder="Ex: 38 BR / M" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Condição</label>
                <select 
                  name="condition"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                >
                  <option value="NOVO_COM_ETIQUETA">Novo com Etiqueta (10/10)</option>
                  <option value="SEMINOVO" selected>Seminovo (9/10)</option>
                  <option value="OTIMO_ESTADO">Ótimo Estado (8/10)</option>
                  <option value="BOM_ESTADO">Bom Estado (7/10)</option>
                  <option value="VINTAGE">Vintage Autenticado</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Cor Principal</label>
                <input 
                  name="color"
                  type="text" 
                  placeholder="Ex: Preto" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Material</label>
                <input 
                  name="material"
                  type="text" 
                  placeholder="Ex: Couro Lambskin" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Direita: Preço & Mídia ── */}
        <div className="space-y-6">
          
          {/* Precificação */}
          <div className="glass-card p-8 border border-white/5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Precificação
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Preço de Venda (R$)</label>
                <input 
                  name="price"
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0,00" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Preço Original / Retail (R$)</label>
                <input 
                  name="originalPrice"
                  type="number" 
                  step="0.01"
                  placeholder="0,00" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                />
                <p className="text-[10px] text-white/20 mt-1">Opcional. Usado para mostrar a % de economia.</p>
              </div>
            </div>
          </div>

          {/* Loja & Destaque */}
          <div className="glass-card p-8 border border-white/5 space-y-6">
             <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">Loja</label>
                <select 
                  name="storeId"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                >
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Destaque da Home</p>
                  <p className="text-[10px] text-white/40">Exibir no carrossel principal</p>
                </div>
                <input 
                  name="featured"
                  type="checkbox" 
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                />
              </div>
          </div>

          {/* Mídia Placeholder */}
          <div className="glass-card p-8 border border-white/5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Mídia
            </h3>
            
            <div className="space-y-4">
               <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-tighter">URL da Imagem Principal</label>
                <input 
                  name="mainImageUrl"
                  type="url" 
                  required
                  placeholder="https://..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
                <p className="text-[10px] text-white/20 mt-1 italic">Dica: Use URLs do Unsplash ou Cloudinary para teste.</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 text-center space-y-2">
               <Upload className="w-6 h-6 text-white/10 mx-auto" />
               <p className="text-[10px] text-white/30 uppercase tracking-widest">Upload Direto</p>
               <p className="text-[10px] text-white/20">Desabilitado (Aguardando Cloudinary Keys)</p>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="w-full btn-primary !py-4 flex items-center justify-center gap-3">
             <Check className="w-5 h-5" />
             Publicar Peça
          </button>
        </div>
      </form>
    </div>
  );
}
