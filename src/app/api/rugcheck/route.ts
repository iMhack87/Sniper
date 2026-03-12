import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const addrs = searchParams.get('contract_addresses');

  if (!addrs) {
    return NextResponse.json({ error: 'Missing contract_addresses' }, { status: 400 });
  }

  try {
    const goPlusReq = await fetch(`https://api.gopluslabs.io/api/v1/token_security/8453?contract_addresses=${addrs}`);
    if (!goPlusReq.ok) {
      return NextResponse.json({ error: 'Failed to fetch from GoPlus' }, { status: goPlusReq.status });
    }
    
    const goPlusRes = await goPlusReq.json();
    return NextResponse.json(goPlusRes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
