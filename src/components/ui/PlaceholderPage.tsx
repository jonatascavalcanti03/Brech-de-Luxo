import { Sparkles, Construction } from "lucide-react";
import Link from "next/link";

export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <Construction className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="heading-luxury text-4xl mb-4">{title}</h1>
        <p className="text-sm text-white/40 mb-8 leading-relaxed">
          {description}
        </p>
        <Link href="/" className="btn-primary !py-3 !px-8">
          Voltar para Início
        </Link>
      </div>
    </div>
  );
}
