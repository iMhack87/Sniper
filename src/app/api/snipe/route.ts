import { NextResponse } from 'next/server';
import { parseEther } from 'viem';

export async function POST(request: Request) {
  try {
    const { tokenAddress, ethAmount, slippage, userAddress } = await request.json();

    if (!tokenAddress || !ethAmount || !userAddress) {
      return NextResponse.json({ error: 'Missing parameters (tokenAddress, ethAmount, userAddress)' }, { status: 400 });
    }

    const maxBuyEth = parseFloat(process.env.MAX_BUY_ETH || '0.1');

    if (parseFloat(ethAmount) > maxBuyEth) {
      return NextResponse.json({ error: `Le montant dépasse la limite de sécurité max de ${maxBuyEth} ETH configurée.` }, { status: 403 });
    }

    const amountInWei = parseEther(ethAmount.toString()).toString();
    const slippageBps = Math.floor(parseFloat(slippage) * 100);

    const tokenIn = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    const routeUrl = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${tokenIn}&tokenOut=${tokenAddress}&amountIn=${amountInWei}`;
    
    const routeRes = await fetch(routeUrl);
    if (!routeRes.ok) throw new Error('Impossible de trouver un pool de liquidité paires/tokens sur Base.');
    
    const routeData = await routeRes.json();
    if (routeData.code !== 0 || !routeData.data.routeSummary) {
       throw new Error('Liquidité insuffisante pour trader ce token actuellement.');
    }

    const buildReqBody = {
      routeSummary: routeData.data.routeSummary,
      sender: userAddress,
      recipient: userAddress,
      slippageTolerance: slippageBps
    };

    const buildRes = await fetch('https://aggregator-api.kyberswap.com/base/api/v1/route/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildReqBody)
    });

    if (!buildRes.ok) throw new Error('Erreur API lors de la création de la transaction.');
    
    const buildData = await buildRes.json();
    if (buildData.code !== 0 || !buildData.data) {
      throw new Error(buildData.message || 'Impossible de générer la transaction (Slippage trop faible / Volatilité).');
    }

    const txData = buildData.data.data;
    const routerAddress = buildData.data.routerAddress;

    return NextResponse.json({ 
      success: true, 
      txParams: {
        to: routerAddress,
        data: txData,
        value: amountInWei
      },
      message: 'Transaction générée avec succès ! Veuillez signer dans votre portefeuille.' 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur de Snipe :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
