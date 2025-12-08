import { NextRequest, NextResponse } from "next/server";
const WOODPECKER_API_URL = `${process.env.API_SRV_ROOT}`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");

    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    //Make the secure server-to-server post request to Woodpecker
    const wpResponse = await fetch(
      `${WOODPECKER_API_URL}/v2/campaigns/${id}/pause`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use the API key received from the client for authorization
          "x-api-key": `${apiKey}`,
        },
      }
    );

    //Handle Woodpecker's response status
    if (!wpResponse.ok) {
      const errorData = await wpResponse.json();

      // Forward the error status/message from Woodpecker to the client
      return NextResponse.json(errorData, { status: wpResponse.status });
    }

    return NextResponse.json(
      {
        id: parseInt(id),
        status: "OK",
        statusCode: wpResponse.status,
        message: "Campaign paused successfully",
      },
      { status: wpResponse.status }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to pause campaign" },
      { status: 500 }
    );
  }
}
