import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  type TenantWithMemberships = Prisma.TenantGetPayload<{
    include: {
      memberships: {
        include: {
          user: true;
        };
      };
    };
  }>;

  const tenants: TenantWithMemberships[] = await prisma.tenant.findMany({
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

       {tenants.map((tenant: (typeof tenants)[number]) => (
        <div key={tenant.id} style={{ marginBottom: 20 }}>
          <h2>{tenant.name}</h2>

          <ul>
            {tenant.memberships.map((membership: (typeof tenant.memberships)[number]) => (
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