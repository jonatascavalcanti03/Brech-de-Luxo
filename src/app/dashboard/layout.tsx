import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  PlusCircle,
  Search,
  Bell
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Proteção de Rota: Apenas Admin pode acessar
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "STORE_ADMIN")) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  const sidebarLinks = [
    { label: "Visão Geral", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Inventário", icon: Package, href: "/dashboard/inventory" },
    { label: "Vendas", icon: ShoppingBag, href: "/dashboard/sales" },
    { label: "Clientes", icon: Users, href: "/dashboard/customers" },
    { label: "Configurações", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col fixed inset-y-0 z-50">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald to-rose-gold flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-bold text-xl text-white">Luxé <span className="text-xs text-white/40 block -mt-1 font-sans font-normal tracking-widest uppercase">Admin</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all group"
            >
              <link.icon className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald to-rose-gold flex items-center justify-center text-[10px] font-bold text-white">
              {session.user.name?.[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
              <p className="text-[10px] text-white/40 truncate capitalize">{session.user.role.replace("_", " ")}</p>
            </div>
          </div>
          
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut className="w-4 h-4" />
            Sair do Painel
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 pl-64 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-white/20 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Pesquisar no painel..." 
                className="w-full bg-white/5 border border-white/5 rounded-full py-1.5 pl-10 pr-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-white/40 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-[#0a0a0a]" />
            </button>
            <Link href="/dashboard/inventory/new" className="btn-primary !py-2 !px-4 !text-xs !rounded-full">
              <PlusCircle className="w-3.5 h-3.5" />
              Novo Produto
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
