"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Condition } from "@prisma/client";

/**
 * Server Action: Criar um novo produto no banco de dados
 */
export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const brand = formData.get("brand") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const size = formData.get("size") as string;
  const color = formData.get("color") as string;
  const material = formData.get("material") as string;
  const condition = formData.get("condition") as Condition;
  const price = parseFloat(formData.get("price") as string);
  const originalPriceRaw = formData.get("originalPrice") as string;
  const originalPrice = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
  const storeId = formData.get("storeId") as string;
  const featured = formData.get("featured") === "on";
  const mainImageUrl = formData.get("mainImageUrl") as string;

  // 1. Gerar Slug simples (em prod usar uma lib como 'slugify')
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") + "-" + Math.random().toString(36).substring(2, 7);

  // 2. Salvar no Banco
  await prisma.product.create({
    data: {
      title,
      slug,
      brand,
      category,
      description,
      size,
      color,
      material,
      condition,
      price,
      originalPrice,
      storeId,
      featured,
      mediaUrls: [
        { url: mainImageUrl, type: "image" }
      ],
      status: "AVAILABLE",
    },
  });

  // 3. Revalidar cache das páginas públicas
  revalidatePath("/");
  revalidatePath("/vitrine");
  revalidatePath("/dashboard/inventory");

  // 4. Redirecionar
  redirect("/dashboard/inventory");
}
