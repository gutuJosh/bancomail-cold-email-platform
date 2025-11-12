import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const apiKey = cookieStore.get('woodpecker_api_key');

    if (!apiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mockProspects = [
      {
        id: 1,
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        company: 'Example Corp',
        status: 'pending',
      },
    ];

    return NextResponse.json(mockProspects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prospects' }, { status: 500 });
  }
}
