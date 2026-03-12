import { NextResponse } from 'next/server';

export const revalidate = 0; // Disable caching

interface DexScreenerPair {
  chainId: string;
  baseToken: { address: string; name: string; symbol: string };
  pairCreatedAt: number;
  liquidity?: { usd: number };
  fdv?: number;
  info?: { imageUrl?: string };
}

export async function GET() {
  try {
    // 1. We first fetch recently created token profiles which is an active DexScreener endpoint
    const profilesRes = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', { next: { revalidate: 0 } });
    if (!profilesRes.ok) throw new Error('Failed to fetch profiles');
    const profiles: any[] = await profilesRes.json();
    
    // 2. Filter base profiles
    const baseTokens = profiles.filter((p) => p.chainId === 'base').map(p => p.tokenAddress);

    // If no base tokens found recently, let's fallback to some trending ones.
    const searchRes = await fetch('https://api.dexscreener.com/latest/dex/search?q=base', { next: { revalidate: 0 } });
    const searchData = await searchRes.json();
    
    let pairs: DexScreenerPair[] = searchData.pairs || [];
    pairs = pairs.filter((p) => p.chainId === 'base');

    // Add specific fresh tokens if we found some
    if (baseTokens.length > 0) {
      const tokensUrl = `https://api.dexscreener.com/latest/dex/tokens/${baseTokens.slice(0, 30).join(',')}`;
      const tokenRes = await fetch(tokensUrl, { next: { revalidate: 0 } });
      const tokenData = await tokenRes.json();
      if (tokenData.pairs) {
        // Interleave fresh ones with trending
        pairs = [...tokenData.pairs.filter((p: DexScreenerPair) => p.chainId === 'base'), ...pairs];
      }
    }

    // Deduplicate by pair address
    const uniquePairsMap = new Map();
    for (const pair of pairs) {
      // Prioritize pairs with liquidity
      if (!uniquePairsMap.has(pair.baseToken.address) && pair.liquidity && pair.liquidity.usd > 100) {
        uniquePairsMap.set(pair.baseToken.address, pair);
      }
    }
    
    const tokenList = Array.from(uniquePairsMap.values()).slice(0, 30); // Top 30

    // Enhance with GoPlus Risk Data via our internal API map
    // We fetch them in chunks to avoid URL too long
    const addresses = tokenList.map(p => p.baseToken.address).join(',');
    let goplusData: Record<string, any> = {};
    if (addresses.length > 0) {
      try {
        const goPlusReq = await fetch(`https://api.gopluslabs.io/api/v1/token_security/8453?contract_addresses=${addresses}`);
        if(goPlusReq.ok) {
           const goPlusRes = await goPlusReq.json();
           goplusData = goPlusRes.result || {};
        }
      } catch (err) {
        console.error("GoPlus API Error:", err);
      }
    }

    const formattedList = tokenList.map((pair) => {
      const address = pair.baseToken.address.toLowerCase();
      const riskDetails = goplusData[address];

      // Risk score evaluation
      let riskLevel = 'YELLOW';
      const hints = [];
      const ageMinutes = (Date.now() - (pair.pairCreatedAt || Date.now())) / 60000;
      const liq = pair.liquidity?.usd || 0;

      if (riskDetails) {
        const buyTax = parseFloat(riskDetails.buy_tax) || 0;
        const sellTax = parseFloat(riskDetails.sell_tax) || 0;
        const ownerRenounced = riskDetails.owner_address === '0x0000000000000000000000000000000000000000';
        const isHoneypot = riskDetails.is_honeypot === '1';
        const isBlacklisted = riskDetails.is_blacklisted === '1';
        const canMint = riskDetails.is_mintable === '1';
        const slippageModifiable = riskDetails.slippage_modifiable === '1';

        // High Risk Indicators
        if (isHoneypot || isBlacklisted || canMint || buyTax > 0.5 || sellTax > 0.5 || slippageModifiable) {
           riskLevel = 'RED';
           if(isHoneypot) hints.push('Honeypot');
           if(isBlacklisted) hints.push('Blacklisted');
           if(canMint) hints.push('Mintable');
           if(slippageModifiable) hints.push('Taxes Modifiables');
           if(buyTax > 0.5 || sellTax > 0.5) hints.push('Taxes > 50%');
        } 
        // Medium Risk Indicators
        else if (!ownerRenounced || buyTax > 0.15 || sellTax > 0.15 || liq < 10000 || ageMinutes < 5) {
           riskLevel = 'YELLOW';
           if(!ownerRenounced) hints.push('Owner non renouncé');
           if(buyTax > 0.15 || sellTax > 0.15) hints.push('Taxes > 15%');
           if(liq < 10000) hints.push('Liq < 10k$');
           if(ageMinutes < 5) hints.push('Recent (<5 min)');
        }
        // Low Risk Indicators
        else {
           riskLevel = 'GREEN';
           hints.push('Safe (Basic)');
        }
      } else {
        // Fallback simple checks if GoPlus fails
        if (liq < 10000 || ageMinutes < 5) riskLevel = 'YELLOW';
        if (liq < 1000 && ageMinutes < 2) riskLevel = 'RED';
      }

      return {
        address: pair.baseToken.address,
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        imageUrl: pair.info?.imageUrl || null,
        liquidityUsd: liq,
        fdv: pair.fdv || 0,
        ageMinutes: Math.floor(ageMinutes),
        riskLevel,
        riskHints: hints,
        dexScreenerLink: pair.url
      };
    });

    return NextResponse.json({ tokens: formattedList }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
