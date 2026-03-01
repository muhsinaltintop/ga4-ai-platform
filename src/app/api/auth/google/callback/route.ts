import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

function decodeJwt(token: string) {
  const payload = token.split(".")[1];
  const decoded = Buffer.from(payload, "base64").toString("utf-8");
  return JSON.parse(decoded);
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "No code found" },
        { status: 400 }
      );
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.id_token) {
      return NextResponse.json(
        { error: "No id_token received" },
        { status: 400 }
      );
    }

    const userInfo = decodeJwt(tokens.id_token);
    const email = userInfo.email;
    const googleSub = userInfo.sub;

    // USER
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: userInfo.name,
        },
      });
    }

    // TENANT
    let membership = await prisma.tenantUser.findFirst({
      where: { userId: user.id },
    });

    let tenant;

    if (!membership) {
      tenant = await prisma.tenant.create({
        data: {
          name: `${userInfo.name}'s Workspace`,
        },
      });

      await prisma.tenantUser.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: "ADMIN",
        },
      });
    } else {
      tenant = await prisma.tenant.findUnique({
        where: { id: membership.tenantId },
      });
    }

    // GA CONNECTION
    await prisma.gAConnection.create({
      data: {
        tenantId: tenant!.id,
        userId: user.id,
        googleSub,
        email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
    });

    return NextResponse.json({
      message: "OAuth complete",
      user,
      tenant,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "OAuth failed" },
      { status: 500 }
    );
  }
}