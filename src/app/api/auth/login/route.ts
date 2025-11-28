// app/api/woodpecker/auth/route.ts

import { NextResponse } from 'next/server';
// Assuming you created AuthRequestBody in a types file
// import { AuthRequestBody } from '@/types/api'; 

const WOODPECKER_API_URL = `${process.env.API_SRV_ROOT}/v1/me`;

export async function POST(request: Request) {
  try {
    // 1. Get client data and assert the type
    const { apiKey } = (await request.json()) as { apiKey: string }; 
    
    // 2. Validate essential data (Optional but good practice)
    if (!apiKey) {
      return NextResponse.json({ message: 'API key is missing.' }, { status: 400 });
    }

    // 3. Make the secure server-to-server request to Woodpecker
    const wpResponse = await fetch(WOODPECKER_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Use the API key received from the client for authorization
        'x-api-key': `${apiKey}`, 
      },
      // If the endpoint requires a body (e.g., for OAuth token exchange), add it here:
      // body: JSON.stringify({ grant_type: 'client_credentials' }), 
    });
    
    // 4. Handle Woodpecker's response status
    if (!wpResponse.ok) {
      const errorData = await wpResponse.json();
    
      // Forward the error status/message from Woodpecker to the client
      return NextResponse.json(errorData, { status: wpResponse.status });
    }

    // 5. Success: Forward the data to the client
    const data = await wpResponse.json();
    data['statusCode'] = 200;
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

    return NextResponse.json({ message: 'Internal Server Error during proxy execution.' }, { status: 500 });
  }
}