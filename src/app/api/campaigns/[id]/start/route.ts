import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(
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
      id: parseInt(id),
      status: 'active',
      message: 'Campaign started successfully',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start campaign' }, { status: 500 });
  }
}
