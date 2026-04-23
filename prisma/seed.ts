import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes (cuidado ao rodar em prod)
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();

  console.log("Seeding Database...");

  // 1. Criar Loja Padrão
  const store = await prisma.store.create({
    data: {
      name: "Luxé Brechó",
      slug: "luxe-brecho",
      description: "O principal brechó de alto luxo do Brasil",
    },
  });

  // 2. Criar Produtos de Exemplo
  const products = [
    {
      title: "Bolsa Chanel Classic Flap Preta",
      slug: "bolsa-chanel-classic-flap-preta",
      brand: "CHANEL",
      category: "Bolsas",
      condition: "SEMINOVO" as const,
      price: 28900.00,
      originalPrice: 45000.00,
      mediaUrls: [
        { url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format", type: "image" }
      ],
      interested: 8,
      status: "AVAILABLE" as const,
      featured: true,
    },
    {
      title: "Hermès Birkin 25 Gold Togo",
      slug: "hermes-birkin-25-gold-togo",
      brand: "HERMÈS",
      category: "Bolsas",
      condition: "OTIMO_ESTADO" as const,
      price: 89500.00,
      originalPrice: null, // Peças que valorizam
      mediaUrls: [
        { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format", type: "image" }
      ],
      interested: 24,
      status: "AVAILABLE" as const,
      featured: true,
    },
    {
      title: "Louis Vuitton Neverfull MM Damier",
      slug: "louis-vuitton-neverfull-mm-damier",
      brand: "LOUIS VUITTON",
      category: "Bolsas",
      condition: "BOM_ESTADO" as const,
      price: 7200.00,
      originalPrice: 9800.00,
      mediaUrls: [
        { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format", type: "image" }
      ],
      interested: 3,
      status: "AVAILABLE" as const,
      featured: true,
    },
    {
      title: "Dior Saddle Bag Vintage",
      slug: "dior-saddle-bag-vintage",
      brand: "DIOR",
      category: "Bolsas",
      condition: "VINTAGE" as const,
      price: 12400.00,
      originalPrice: null,
      mediaUrls: [
        { url: "https://images.unsplash.com/photo-1606822350852-a63d9154a43b?w=800&auto=format", type: "image" }
      ],
      interested: 12,
      status: "SOLD" as const, // Deve ser ocultado na vitrine ou mostrar badge
      featured: false,
    }
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        storeId: store.id,
      }
    });
  }

  console.log("Database Seed Completo! ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
