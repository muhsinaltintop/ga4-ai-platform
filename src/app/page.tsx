import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const tenants = await prisma.tenant.findMany({
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
    },
  });

  return (
    <div style={{ padding: 40 }}>
      <h1>GA4 AI Platform</h1>

      {tenants.map((tenant) => (
        <div key={tenant.id} style={{ marginBottom: 20 }}>
          <h2>{tenant.name}</h2>

          <ul>
            {tenant.memberships.map((membership) => (
              <li key={membership.userId}>
                {membership.user.email} — {membership.role}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}