/**
 * Seed: crear administrador inicial.
 * El id del admin debe coincidir con un usuario en Supabase Auth (auth.users).
 *
 * Uso:
 * 1. Crear en Supabase Dashboard (Authentication > Users) un usuario con el email deseado.
 * 2. Copiar el UUID del usuario (auth.users.id).
 * 3. Ejecutar: ADMIN_ID=<uuid> npx prisma db seed
 *
 * O definir en .env: ADMIN_ID=uuid-del-usuario-auth
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminId = process.env.ADMIN_ID;
  if (!adminId) {
    console.warn(
      "ADMIN_ID no definido. Para crear el admin, crea un usuario en Supabase Auth y luego ejecuta:"
    );
    console.warn('  ADMIN_ID=<uuid> npx prisma db seed');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@despacho.local";

  await prisma.user.upsert({
    where: { id: adminId },
    create: {
      id: adminId,
      email: adminEmail,
      fullName: "Administrador",
      role: "admin",
      status: "active",
      isActive: true,
    },
    update: {
      role: "admin",
      status: "active",
      isActive: true,
      updatedAt: new Date(),
    },
  });

  console.log("Administrador configurado correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
