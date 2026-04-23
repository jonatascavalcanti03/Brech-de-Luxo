import { prisma } from "@/lib/prisma";
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  // 1. Buscar estatísticas reais do banco
  const [totalProducts, totalSales, pendingOrders, soldProducts] = await Promise.all([
    prisma.product.count(),
    prisma.order.aggregate({ _sum: { totalPrice: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { status: "SOLD" } }),
  ]);

  const stats = [
    { 
      label: "Receita Total", 
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(totalSales._sum.totalPrice || 0)), 
      icon: TrendingUp, 
      trend: "+12.5%", 
      isPositive: true 
    },
    { 
      label: "Peças em Estoque", 
      value: totalProducts - soldProducts, 
      icon: Package, 
      trend: "Disponíveis", 
      isPositive: true 
    },
    { 
      label: "Peças Vendidas", 
      value: soldProducts, 
      icon: ShoppingBag, 
      trend: "Vitalício", 
      isPositive: true 
    },
    { 
      label: "Pedidos Pendentes", 
      value: pendingOrders, 
      icon: Clock, 
      trend: "Aguardando", 
      isPositive: false 
    },
  ];

  // 2. Buscar últimas vendas
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { product: { select: { title: true, mediaUrls: true } } }
  });

  return (
    <div className="space-y-8">
      {/* ── Greeting ── */}
      <div>
        <h1 className="text-2xl font-serif text-white">Bem-vindo ao Painel Luxé</h1>
        <p className="text-sm text-white/40 mt-1">Aqui está o que está acontecendo com sua boutique hoje.</p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
                stat.isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-white/10 text-white/40"
              }`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : null}
                {stat.trend}
              </div>
            </div>
            <p className="text-xs text-white/40 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Recent Sales ── */}
        <div className="lg:col-span-2 glass-card border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Últimas Vendas</h3>
            <Link href="/dashboard/sales" className="text-xs text-emerald-400 hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 relative">
                     {/* Imagem do produto seria aqui */}
                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white line-clamp-1">{order.product.title}</p>
                    <p className="text-xs text-white/40">{order.customerName} • {order.paymentMethod}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(order.totalPrice))}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-tight ${
                    order.status === "PAID" ? "text-emerald-400" : "text-amber-400"
                  }`}>{order.status}</p>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <p className="text-sm text-white/20">Nenhuma venda registrada ainda.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-white/5 bg-gradient-to-br from-emerald/10 to-transparent">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <Link href="/dashboard/inventory/new" className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald/30 transition-all group">
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">Adicionar Peça</span>
                <PlusCircle className="w-4 h-4 text-white/20 group-hover:text-emerald-400" />
              </Link>
              <Link href="/vitrine" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald/30 transition-all group">
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">Ver Loja Ao Vivo</span>
                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-emerald-400" />
              </Link>
            </div>
          </div>

          <div className="glass-card p-6 border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Dica de Performance</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Peças com mais de 5 fotos vendem em média 35% mais rápido. Experimente adicionar fotos de detalhes dos logos e etiquetas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const PlusCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
);
