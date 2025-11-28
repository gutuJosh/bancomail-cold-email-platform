import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const WOODPECKER_API_URL = `${process.env.API_SRV_ROOT}`;

export async function GET(request: Request) {
  try {
    // 1. Get client data and assert the type
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    
    // 2. Validate essential data (Optional but good practice)
    if (!apiKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // 3. Make the secure server-to-server request to Woodpecker
    const wpResponse = await fetch(`${WOODPECKER_API_URL}/v1/campaign_list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Use the API key received from the client for authorization
        'x-api-key': `${apiKey}`, 
      },
    });

    // 4. Handle Woodpecker's response status
    if (!wpResponse.ok) {
      const errorData = await wpResponse.json();
    
      // Forward the error status/message from Woodpecker to the client
      return NextResponse.json(errorData, { status: wpResponse.status });
    }

    // Se non c'è contenuto, restituisci un oggetto vuoto per evitare errori di parsing JSON
    if (wpResponse.status === 204) {
    
         const data = {
            'statusCode': wpResponse.status,
            'status':'OK'
         };
         return NextResponse.json(data, { status: 204 });
    }


     // 5. Success: Forward the data to the client
    const data = await wpResponse.json();
    data['statusCode'] = wpResponse.status;
    data['status'] = 'OK';

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    // Catch any network or parsing errors (e.g., JSON parse failed)
  
    // Use the TypeScript fix for 'unknown' type errors
    if (error instanceof Error) {
        console.error('Proxy Error:', error.message);
    } else {
        console.error('Unknown proxy error:', error);
    }

    return NextResponse.json({ message: 'Internal Server Error during proxy fetch campaigns.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const apiKey = cookieStore.get('woodpecker_api_key');

    if (!apiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, subject, content } = await request.json();

    const newCampaign = {
      id: Date.now(),
      name,
      subject,
      content,
      status: 'draft' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_prospects: 0,
    };

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
