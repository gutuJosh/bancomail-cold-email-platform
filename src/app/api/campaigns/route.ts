import { NextRequest, NextResponse } from "next/server";

const WOODPECKER_API_URL = `${process.env.API_SRV_ROOT}`;

export async function GET(request: Request) {
  try {
    // 1. Get client data and assert the type
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");

    // 2. Validate essential data
    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // 3. Make the secure server-to-server request to Woodpecker
    const wpResponse = await fetch(`${WOODPECKER_API_URL}/v1/campaign_list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Use the API key received from the client for authorization
        "x-api-key": `${apiKey}`,
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
        statusCode: wpResponse.status,
        status: "OK",
      };
      return NextResponse.json(data, { status: 204 });
    }

    // 5. Success: Forward the data to the client
    const data = await wpResponse.json();
    data["statusCode"] = wpResponse.status;
    data["status"] = "OK";

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // Catch any network or parsing errors (e.g., JSON parse failed)

    // Use the TypeScript fix for 'unknown' type errors
    if (error instanceof Error) {
      console.error("Proxy Error:", error.message);
    } else {
      console.error("Unknown proxy error:", error);
    }

    return NextResponse.json(
      { message: "Internal Server Error during proxy fetch campaigns." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      apiKey,
      name,
      email_account_ids,
      subject,
      content,
      settings,
      timezone,
      daily_enroll,
      gdpr_unsubscribe,
      list_unsubscribe,
    } = (await request.json()) as {
      apiKey: string;
      name: string;
      email_account_ids: number[];
      subject: string;
      content: string;
      settings: { [key: string]: { from: string; to: string }[] } | {};
      timezone: string;
      daily_enroll: number;
      gdpr_unsubscribe: boolean;
      list_unsubscribe: boolean;
    };

    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = {
      name: name,
      email_account_ids: email_account_ids,
      settings: {
        timezone: timezone,
        daily_enroll: daily_enroll,
        gdpr_unsubscribe: gdpr_unsubscribe,
        list_unsubscribe: list_unsubscribe,
      },
      steps: {
        type: "START",
        followup: {
          type: "EMAIL",
          delivery_time: settings,
          body: {
            versions: [
              {
                subject: subject,
                message: content,
                signature: "SENDER",
                track_opens: true,
              },
            ],
          },
        },
      },
      status: "draft" as const,
    };

    //Make the secure server-to-server request to Woodpecker
    const wpResponse = await fetch(`${WOODPECKER_API_URL}/v2/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Use the API key received from the client for authorization
        "x-api-key": `${apiKey}`,
      },
      // If the endpoint requires a body add it here:
      body: JSON.stringify(body),
    });

    //Handle Woodpecker's response status
    if (!wpResponse.ok) {
      const errorData = await wpResponse.json();
      // Forward the error status/message from Woodpecker to the client
      return NextResponse.json(errorData, { status: wpResponse.status });
    }

    const data = await wpResponse.json();
    data["status"] = "OK";
    data["statusCode"] = wpResponse.status;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
