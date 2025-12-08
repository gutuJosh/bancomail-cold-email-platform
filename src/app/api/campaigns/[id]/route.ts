import { NextRequest, NextResponse } from "next/server";
import { StringKeyedObject } from "@/types/global";

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

    // 6. Success! Request stats data
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const {
      step_id = null,
      version_id = null,
      apiKey = null,
      name = null,
      subject = null,
      message = null,
      track_opens = null,
      signature = null,
      timezone = null,
      daily_enroll = 500,
      email_account_ids = null,
      gdpr_unsubscribe = true,
      list_unsubscribe = true,
      path = null,
    } = data;

    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const urls: StringKeyedObject = {
      update_step_version: `/v2/campaigns/${id}/steps/${step_id}/versions/${version_id}`,
      update_campaign_settings: `/v2/campaigns/${id}`,
    };

    let body = {};
    if (path === "update_step_version") {
      body = {
        subject: subject,
        message: message,
        signature: signature ? "SENDER" : "NO_SIGNATURE",
        track_opens: track_opens,
      };
    }
    if (path === "update_campaign_settings") {
      body = {
        name: name,
        email_account_ids: email_account_ids,
        settings: {
          timezone: timezone,
          daily_enroll: daily_enroll,
          gdpr_unsubscribe: gdpr_unsubscribe,
          list_unsubscribe: list_unsubscribe,
          auto_pause_prospect_from_domain: true,
          catch_all_verification_mode: "MAXIMUM",
        },
      };
    }

    //Make campaign editable
    const isCampaignEditable = await fetch(
      `${process.env.API_SRV_ROOT}/v2/campaigns/${id}/make_editable`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use the API key received from the client for authorization
          "x-api-key": `${apiKey}`,
        },
      }
    );

    if (!isCampaignEditable.ok) {
      const errorData = await isCampaignEditable.json();
      console.log("ERROR CAMPAIGN EDIT---->", errorData);
      // Forward the error status/message from Woodpecker to the client
      return NextResponse.json(errorData, {
        status: isCampaignEditable.status,
      });
    }

    //Make the secure server-to-server post request to Woodpecker
    const wpResponse = await fetch(`${process.env.API_SRV_ROOT}${urls[path]}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Use the API key received from the client for authorization
        "x-api-key": `${apiKey}`,
      },
      // add body here:
      body: JSON.stringify(body),
    });

    if (!wpResponse.ok) {
      const errorData = await wpResponse.json();
      console.log("URI-->", urls[data.step]);
      console.log("BODYI-->", body);
      console.log("ERROR-->", errorData);
      // Forward the error status/message from Woodpecker to the client
      return NextResponse.json(errorData, { status: wpResponse.status });
    }

    const response = await wpResponse.json();
    response["statusCode"] = wpResponse.status;
    response["status"] = "OK";

    return NextResponse.json(response, { status: 200 });
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
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");

    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    //Make the secure server-to-server post request to Woodpecker
    const wpResponse = await fetch(`${WOODPECKER_API_URL}/v2/campaigns/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Use the API key received from the client for authorization
        "x-api-key": `${apiKey}`,
      },
    });

    // Handle Woodpecker's response status
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
        message: "Campaign deleted successfully",
      },
      { status: wpResponse.status }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
