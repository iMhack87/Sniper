import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "file:./dev.db",
});

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        totalVolume: 'desc'
      },
      take: 100,
    });

    return NextResponse.json({ success: true, leaderboard: users }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur Prisma :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
