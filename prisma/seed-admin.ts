import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Criando Super Admin...");

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@luxe.com" },
    update: {},
    create: {
      email: "admin@luxe.com",
      name: "Admin Luxé",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Admin criado: admin@luxe.com / admin123 ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
