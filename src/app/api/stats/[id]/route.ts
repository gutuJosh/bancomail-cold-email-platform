import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const apiKey = cookieStore.get('woodpecker_api_key');

    if (!apiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    return NextResponse.json({
      campaign_id: parseInt(id),
      total_sent: 150,
      total_opened: 75,
      total_replied: 15,
      total_bounced: 5,
      open_rate: 50.0,
      reply_rate: 10.0,
      bounce_rate: 3.3,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
