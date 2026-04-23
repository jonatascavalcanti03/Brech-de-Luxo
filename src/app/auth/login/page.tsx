"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Credenciais inválidas. Tente novamente.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Ocorreu um erro ao entrar. Tente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-rose-gold/5 blur-[100px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald to-rose-gold flex items-center justify-center shadow-lg shadow-emerald/20 group-hover:rotate-12 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="heading-luxury text-3xl mb-2">Acesso Restrito</h1>
          <p className="text-sm text-white/40">Entre com suas credenciais de administrador Luxé.</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/20 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@luxe.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40">Senha</label>
                  <button type="button" className="text-[10px] text-white/20 hover:text-white transition-colors">Esqueceu?</button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/20 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary !py-4 flex items-center justify-center gap-3 shadow-lg shadow-emerald/20 hover:shadow-emerald/40 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar no Painel
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-white/20">
          Problemas com o acesso? <Link href="/" className="text-white/40 hover:text-emerald-400 transition-colors">Contate o suporte técnico.</Link>
        </p>
      </motion.div>
    </div>
  );
}
