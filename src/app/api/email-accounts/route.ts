import { NextRequest, NextResponse } from 'next/server';
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
    const wpResponse = await fetch(`${WOODPECKER_API_URL}/v2/mailboxes`, {
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
         return NextResponse.json(data, { status: wpResponse.status });
    }
    //handle errors
    if (wpResponse.status !== 200) {
    
         const data = {
            'statusCode': wpResponse.status,
            'status':'KO'
         };
         console.log('ERROR---->',wpResponse)
         return NextResponse.json(data, { status: wpResponse.status });
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

    const { apiKey } = (await request.json()) as { apiKey: string}; 
   
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
