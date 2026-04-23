import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";
import { CustomCursor } from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: {
    default: "Brechó de Luxo | Peças Únicas & Exclusivas",
    template: "%s | Brechó de Luxo",
  },
  description:
    "Curadoria exclusiva de peças de moda de luxo, vintage e seminovas. Cada peça é única, tratada como obra de arte. Encontre sua próxima joia fashion aqui.",
  keywords: [
    "brechó de luxo",
    "moda vintage",
    "peças exclusivas",
    "segunda mão luxo",
    "moda sustentável",
    "designer vintage",
    "brechó online",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Brechó de Luxo | Peças Únicas & Exclusivas",
    description:
      "Curadoria exclusiva de peças de moda de luxo, vintage e seminovas. Cada peça é única.",
    siteName: "Brechó de Luxo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brechó de Luxo | Peças Únicas & Exclusivas",
    description: "Curadoria exclusiva de peças de moda de luxo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="bg-obsidian text-white antialiased">
        <Providers>
          {/* Custom cursor – rendered client-side */}
          <CustomCursor />

          {/* Navbar glassmorphism fixa */}
          <Navbar />

          {/* Conteúdo principal com animações de transição */}
          <main className="min-h-screen">{children}</main>

          {/* Background ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
          >
            {/* Top-left emerald orb */}
            <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald/5 blur-[120px]" />
            {/* Bottom-right gold orb */}
            <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-rose-gold/5 blur-[120px]" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
