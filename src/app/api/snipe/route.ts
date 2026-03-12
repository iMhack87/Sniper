import { NextResponse } from 'next/server';
import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

export async function POST(request: Request) {
  try {
    const { tokenAddress, ethAmount, slippage, gasPriority } = await request.json();

    if (!tokenAddress || !ethAmount) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
    const privateKeyHex = process.env.PRIVATE_KEY;
    const maxBuyEth = parseFloat(process.env.MAX_BUY_ETH || '0.1');

    if (parseFloat(ethAmount) > maxBuyEth) {
      return NextResponse.json({ error: `Le montant dépasse la limite de sécurité max de ${maxBuyEth} ETH configurée.` }, { status: 403 });
    }

    // MOCK MODE IF NO REAL KEY PROVIDED
    if (!privateKeyHex || privateKeyHex.length < 60 || privateKeyHex.includes('ta_cle_privee')) {
      await new Promise(r => setTimeout(r, 1500)); // Simulate network
      return NextResponse.json({ 
        success: true, 
        hash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        message: 'Simulation réussie. (Ajoutez une PRIVATE_KEY pour les vrais achats)'
      }, { status: 200 });
    }

    let account;
    try {
      const formattedPk = privateKeyHex.trim().startsWith('0x') ? privateKeyHex.trim() : `0x${privateKeyHex.trim()}`;
      account = privateKeyToAccount(formattedPk as `0x${string}`);
    } catch (err) {
      return NextResponse.json({ error: 'La PRIVATE_KEY configurée est invalide.' }, { status: 400 });
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
      sender: account.address,
      recipient: account.address,
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

    const publicClient = createPublicClient({ chain: base, transport: http(rpcUrl) });
    const walletClient = createWalletClient({ account, chain: base, transport: http(rpcUrl) });

    const hash = await walletClient.sendTransaction({
      account,
      to: routerAddress as `0x${string}`,
      data: txData as `0x${string}`,
      value: BigInt(amountInWei)
    });

    return NextResponse.json({ success: true, hash: hash, message: 'Achat envoyé sur Base avec succès !' }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur de Snipe :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
