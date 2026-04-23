"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  Heart,
  ShoppingBag,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
} from "lucide-react";
import { clsx } from "clsx";

const NAV_LINKS = [
  { label: "Vitrine",    href: "/vitrine" },
  { label: "Categorias", href: "/categorias" },
  { label: "Marcas",     href: "/marcas" },
  { label: "Vintage",    href: "/vintage" },
  { label: "Novidades",  href: "/novidades" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  // Detect scroll
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setIsScrolled(v > 20));
    return unsub;
  }, [scrollY]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        id="navbar"
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "navbar-glass py-3" : "py-5"
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Animated background overlay */}
        <motion.div
          className="absolute inset-0 navbar-glass -z-10"
          style={{ opacity: navOpacity }}
        />

        <div className="section-container">
          <div className="flex items-center justify-between gap-8">
            {/* ── Logo ── */}
            <Link href="/" id="navbar-logo" className="flex items-center gap-2.5 group flex-shrink-0">
              <motion.div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #10b981, #d4af37)",
                }}
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div className="leading-none">
                <span className="block font-serif font-bold text-lg text-white tracking-tight">
                  Luxé
                </span>
                <span className="block text-[10px] text-emerald tracking-[0.2em] uppercase font-medium">
                  Brechó de Elite
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    id={`nav-${link.label.toLowerCase()}`}
                    className={clsx(
                      "relative px-4 py-2 text-sm font-medium rounded-lg",
                      "transition-colors duration-200",
                      isActive
                        ? "text-emerald"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "rgba(16,185,129,0.1)" }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/vitrine"
                  id="navbar-search"
                  aria-label="Buscar peças"
                  className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-white/50 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <Search className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Wishlist */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/wishlist"
                  id="navbar-wishlist"
                  aria-label="Minha lista de desejos"
                  className="relative flex items-center justify-center w-9 h-9 rounded-lg text-white/50 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <Heart className="w-4 h-4" />
                  <span
                    className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                  >
                    2
                  </span>
                </Link>
              </motion.div>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/cart"
                  id="navbar-cart"
                  aria-label="Sacola de compras"
                  className="relative flex items-center justify-center w-9 h-9 rounded-lg text-white/50 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <ShoppingBag className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Auth */}
              {session ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    id="navbar-user-menu"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald to-rose-gold flex items-center justify-center text-white text-[10px] font-bold">
                      {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <ChevronDown
                      className={clsx(
                        "w-3.5 h-3.5 text-white/50 transition-transform duration-200",
                        userMenuOpen && "rotate-180"
                      )}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/8 overflow-hidden"
                        style={{
                          background: "rgba(10,10,10,0.95)",
                          backdropFilter: "blur(24px)",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                        }}
                      >
                        <div className="p-3 border-b border-white/5">
                          <p className="text-sm font-medium text-white truncate">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-white/40 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <div className="p-1.5">
                          {(session.user?.role === "SUPER_ADMIN" || session.user?.role === "STORE_ADMIN") && (
                            <Link
                              href="/dashboard"
                              id="nav-dashboard"
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard Admin
                            </Link>
                          )}
                          <Link
                            href="/perfil"
                            id="nav-profile"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <User className="w-4 h-4" />
                            Meu Perfil
                          </Link>
                          <button
                            id="nav-signout"
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            Sair
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/auth/login"
                    id="navbar-login"
                    className="btn-primary !py-2 !px-4 !text-xs"
                  >
                    Entrar
                  </Link>
                </motion.div>
              )}

              {/* Mobile menu button */}
              <motion.button
                id="navbar-mobile-menu"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white/60 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.04)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Menu mobile"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:hidden overflow-hidden border-t border-white/5"
              style={{ background: "rgba(5,5,5,0.95)", backdropFilter: "blur(32px)" }}
            >
              <nav className="section-container py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className={clsx(
                        "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        pathname === link.href
                          ? "text-emerald bg-emerald/8"
                          : "text-white/60 hover:text-white hover:bg-white/4"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}
