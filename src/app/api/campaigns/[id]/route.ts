import { NextRequest, NextResponse } from "next/server";
const WOODPECKER_API_URL = `${process.env.API_SRV_ROOT}`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Get client data and assert the type
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");

    // 2. Validate essential data
    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    //3. Get camapign id from URI
    const { id } = await params;

    // 4. Make the secure server-to-server request to Woodpecker
    const wpResponse = await fetch(`${WOODPECKER_API_URL}/v2/campaigns/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Use the API key received from the client for authorization
        "x-api-key": `${apiKey}`,
      },
    });

    // 5. Handle Woodpecker's response status
    if (!wpResponse.ok) {
      const errorData = await wpResponse.json();

      // Forward the error status/message from Woodpecker to the client
      return NextResponse.json(errorData, { status: wpResponse.status });
    }

    // 6. Success! Request stats
    const wpStats = await fetch(
      `${WOODPECKER_API_URL}/v1/campaign_list?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Use the API key received from the client for authorization
          "x-api-key": `${apiKey}`,
        },
      }
    );

    const data = await wpResponse.json();
    data["statusCode"] = wpResponse.status;
    data["status"] = "OK";

    if (wpStats.ok) {
      const stats = await wpStats.json();
      data["stats"] = stats;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { apiKey } = (await request.json()) as { apiKey: string };

    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    return NextResponse.json({
      id: parseInt(id),
      ...data,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { apiKey } = (await request.json()) as { apiKey: string };

    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
