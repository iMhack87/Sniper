import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "file:./dev.db",
    },
  },
});

export async function POST(request: Request) {
  try {
    const { txHash, userAddress, tokenAddress, ethAmountOut } = await request.json();

    if (!txHash || !userAddress || !ethAmountOut) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Step 1: Ensure user exists
    let user = await prisma.user.findUnique({
      where: { walletAddress: userAddress }
    });

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress: userAddress }
      });
    }

    // Step 2: Record Snipe
    const existingSnipe = await prisma.snipe.findUnique({
      where: { txHash }
    });

    // Don't double count if retry
    if (!existingSnipe) {
      await prisma.snipe.create({
        data: {
          txHash,
          userAddress,
          tokenAddress,
          ethAmountOut: Number(ethAmountOut)
        }
      });

      // Step 3: Update User Volume and Score
      await prisma.user.update({
        where: { walletAddress: userAddress },
        data: {
          totalVolume: { increment: Number(ethAmountOut) },
          score: { increment: 1 } // 1 snipe = 1 point
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Snipe record saved completely.' }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur saving record :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
