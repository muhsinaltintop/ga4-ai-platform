import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "muhsin@example.com",
      name: "Muhsin",
    },
  });

  const tenant1 = await prisma.tenant.create({
    data: { name: "Agency Workspace" },
  });

  const tenant2 = await prisma.tenant.create({
    data: { name: "Client Workspace" },
  });

  await prisma.tenantUser.createMany({
    data: [
      {
        tenantId: tenant1.id,
        userId: user.id,
        role: "ADMIN",
      },
      {
        tenantId: tenant2.id,
        userId: user.id,
        role: "ADMIN",
      },
    ],
  });

  console.log("Seed tamamlandı ✅");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());