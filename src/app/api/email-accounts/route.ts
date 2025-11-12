import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const apiKey = cookieStore.get('woodpecker_api_key');

    if (!apiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mockAccounts = [
      {
        id: 1,
        email: 'sender@example.com',
        name: 'Primary Sender',
        provider: 'gmail',
        status: 'active',
        created_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json(mockAccounts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const apiKey = cookieStore.get('woodpecker_api_key');

    if (!apiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, name, provider } = await request.json();

    const newAccount = {
      id: Date.now(),
      email,
      name,
      provider,
      status: 'active' as const,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
