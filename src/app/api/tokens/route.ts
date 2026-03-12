import { NextResponse } from 'next/server';

export const revalidate = 0; // Disable caching

interface DexScreenerPair {
  chainId: string;
  baseToken: { address: string; name: string; symbol: string };
  pairCreatedAt: number;
  liquidity?: { usd: number };
  fdv?: number;
  info?: { imageUrl?: string };
  url?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    let pairs: DexScreenerPair[] = [];

    if (q) {
      // User is searching for a specific token or query
      if (q.startsWith('0x') && q.length === 42) {
        // Search by token address directly
        const tokenRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${q}`, { next: { revalidate: 0 } });
        if (tokenRes.ok) {
          const data = await tokenRes.json();
          pairs = data.pairs || [];
        }
      } else {
        // Standard text search
        const searchRes = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`, { next: { revalidate: 0 } });
        if (searchRes.ok) {
          const data = await searchRes.json();
          pairs = data.pairs || [];
        }
      }
    } else {
      // No query: Fetch recent tokens on Base
      if (page === 1) {
        // We first fetch the absolute latest profiles from DexScreener
        try {
          const profRes = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', { next: { revalidate: 15 } });
          if (profRes.ok) {
            const profiles: any[] = await profRes.json();
            const baseAddrs = profiles.filter(p => p.chainId === 'base').map(p => p.tokenAddress).slice(0, 30);
            if (baseAddrs.length > 0) {
              const tokenRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${baseAddrs.join(',')}`, { next: { revalidate: 15 } });
              if (tokenRes.ok) {
                const data = await tokenRes.json();
                if (data.pairs) pairs = [...pairs, ...data.pairs];
              }
            }
          }
        } catch (e) { }
      }

      // Then fetch the actual newest pools on Base directly from GeckoTerminal (CoinGecko)
      try {
        const geckRes = await fetch(`https://api.geckoterminal.com/api/v2/networks/base/new_pools?page=${page}`, { next: { revalidate: 15 } });
        if (geckRes.ok) {
           const geckData = await geckRes.json();
           if (geckData.data && Array.isArray(geckData.data)) {
             const geckPairs = geckData.data.map((pool: any) => {
               const address = pool.relationships?.base_token?.data?.id?.replace('base_', '') || '';
               const poolAddr = pool.id?.replace('base_', '') || '';
               const nameParts = (pool.attributes?.name || 'Unknown / Unknown').split(' / ');
               
               // Parse dates correctly, fallback to Date.now() if invalid
               let createdAtTimestamp = Date.now();
               if (pool.attributes?.pool_created_at) {
                 const parsed = new Date(pool.attributes.pool_created_at).getTime();
                 if (!isNaN(parsed) && parsed > 0) {
                   createdAtTimestamp = parsed;
                 }
               }

               return {
                 chainId: 'base',
                 baseToken: {
                   address,
                   name: nameParts[0],
                   symbol: nameParts[0]
                 },
                 pairCreatedAt: createdAtTimestamp,
                 liquidity: { usd: parseFloat(pool.attributes?.reserve_in_usd || '0') },
                 fdv: parseFloat(pool.attributes?.fdv_usd || '0'),
                 url: `https://dexscreener.com/base/${poolAddr}`
               };
             });
             
             pairs = [...pairs, ...geckPairs];
           }
        }
      } catch (e) {}
    }

    // Filter, Deduplicate and Sort
    pairs = pairs.filter((p) => p.chainId === 'base');
    
    const uniquePairsMap = new Map();
    for (const pair of pairs) {
      const address = pair.baseToken.address.toLowerCase();
      // Keep only one pair per token, preferring higher liquidity or newer if similar
      if (!uniquePairsMap.has(address)) {
        uniquePairsMap.set(address, pair);
      } else {
         const existing = uniquePairsMap.get(address);
         
         // If existing pair lacks a createdAt but new one has it, swap it to get the real age!
         if (!existing.pairCreatedAt && pair.pairCreatedAt) {
            uniquePairsMap.set(address, pair);
         }
         // Otherwise, if both have dates or both don't, prefer higher liquidity
         else if ((pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)) {
            // Only overwrite if we don't lose the creation date
            if (pair.pairCreatedAt || !existing.pairCreatedAt) {
              // Copy over the date just in case
              if(!pair.pairCreatedAt && existing.pairCreatedAt) pair.pairCreatedAt = existing.pairCreatedAt;
              uniquePairsMap.set(address, pair);
            }
         }
      }
    }
    
    let tokenList = Array.from(uniquePairsMap.values());
    
    // Filter out pairs that STILL don't have a pairCreatedAt (they are glitched/unlaunched)
    tokenList = tokenList.filter(p => !!p.pairCreatedAt);

    // If no search query, we sort strictly by pairCreatedAt to get the newest!
    if (!q) {
      tokenList.sort((a, b) => (b.pairCreatedAt || 0) - (a.pairCreatedAt || 0));
    }

    tokenList = tokenList.slice(0, 30); // Top 30 Max

    // Fetch GoPlus data for risk scores
    const addresses = tokenList.map(p => p.baseToken.address).join(',');
    let goplusData: Record<string, any> = {};
    if (addresses.length > 0) {
      try {
        const goPlusReq = await fetch(`https://api.gopluslabs.io/api/v1/token_security/8453?contract_addresses=${addresses}`, { next: { revalidate: 15 } });
        if(goPlusReq.ok) {
           const goPlusRes = await goPlusReq.json();
           goplusData = goPlusRes.result || {};
        }
      } catch (err) { }
    }

    const formattedList = tokenList.map((pair) => {
      const address = pair.baseToken.address.toLowerCase();
      const riskDetails = goplusData[address];

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

        if (isHoneypot || isBlacklisted || canMint || buyTax > 0.5 || sellTax > 0.5 || slippageModifiable) {
           riskLevel = 'RED';
           if(isHoneypot) hints.push('Honeypot');
           if(isBlacklisted) hints.push('Blacklisted');
           if(canMint) hints.push('Mintable');
           if(slippageModifiable) hints.push('Taxes Modifiables');
           if(buyTax > 0.5 || sellTax > 0.5) hints.push('Taxes > 50%');
        } 
        else if (!ownerRenounced || buyTax > 0.15 || sellTax > 0.15 || liq < 2000 || ageMinutes < 5) {
           riskLevel = 'YELLOW';
           if(!ownerRenounced) hints.push('Owner non renouncé');
           if(buyTax > 0.15 || sellTax > 0.15) hints.push('Taxes > 15%');
           if(liq < 2000) hints.push('Liq Très Faible (<$2k)');
           if(ageMinutes < 5) hints.push('Très Récent (<5 min)');
        }
        else {
           riskLevel = 'GREEN';
           hints.push('Safe (Basic)');
        }
      } else {
        if (liq < 1000 && ageMinutes < 2) {
          riskLevel = 'RED';
          hints.push('Non audité (GoPlus indisponible)');
          hints.push('Liquidité Critique (<$1k)');
          hints.push('Création immédiate (<2 min)');
        } else if (liq < 5000 || ageMinutes < 5) {
          riskLevel = 'YELLOW';
          hints.push('Non audité (GoPlus indisponible)');
          if (liq < 5000) hints.push('Liquidité Faible (<$5k)');
          if (ageMinutes < 5) hints.push('Très Récent (<5 min)');
        } else {
          riskLevel = 'GREEN';
          hints.push('Safe (Basic)');
        }
      }

      return {
        address: pair.baseToken.address,
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        imageUrl: pair.info?.imageUrl || null,
        liquidityUsd: liq,
        fdv: pair.fdv || 0,
        ageMinutes: Math.max(0, Math.floor(ageMinutes)),
        createdAt: Math.min(pair.pairCreatedAt || Date.now(), Date.now()),
        riskLevel,
        riskHints: hints,
        dexScreenerLink: pair.url,
        socials: pair.info?.socials || [],
        websites: pair.info?.websites || []
      };
    });

    return NextResponse.json({ tokens: formattedList }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
