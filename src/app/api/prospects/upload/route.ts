import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const apiKey = cookieStore.get('woodpecker_api_key');

    if (!apiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignId, prospects } = await request.json();

    const uploadedProspects = prospects.map((p: any, index: number) => ({
      id: Date.now() + index,
      ...p,
      campaign_id: campaignId,
      status: 'pending',
    }));

    return NextResponse.json(uploadedProspects, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload prospects' }, { status: 500 });
  }
}
