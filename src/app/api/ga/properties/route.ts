import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const connection = await prisma.gAConnection.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const accountId = "accounts/111738931"; // ilk account'u koy

  const response = await fetch(
    `https://analyticsadmin.googleapis.com/v1beta/properties?filter=parent:${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${connection?.accessToken}`,
      },
    }
  );

  const data = await response.json();

  return NextResponse.json(data);
}