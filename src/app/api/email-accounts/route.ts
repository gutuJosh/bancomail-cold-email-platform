import { NextRequest, NextResponse } from "next/server";
import { AccountFormData } from "@/types/global";
const WOODPECKER_API_URL = `${process.env.API_SRV_ROOT}`;

export async function GET(request: Request) {
  try {
    // 1. Get client data and assert the type
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");

    // 2. Validate essential data (Optional but good practice)
    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // 3. Make the secure server-to-server request to Woodpecker
    const wpResponse = await fetch(`${WOODPECKER_API_URL}/v2/mailboxes`, {
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
      return NextResponse.json(data, { status: wpResponse.status });
    }
    //handle errors
    if (wpResponse.status !== 200) {
      const data = {
        statusCode: wpResponse.status,
        status: "KO",
      };
      console.log("ERROR---->", wpResponse);
      return NextResponse.json(data, { status: wpResponse.status });
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
    const newAccount = (await request.json()) as AccountFormData;

    const { apiKey } = newAccount;

    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { [key: string]: string | number } = {};

    for (const key in newAccount) {
      const value = newAccount[key] as string;
      if (key === "apiKey" || value.length === 0) {
        continue;
      }

      body[key] = !isNaN(newAccount[key] as number)
        ? Number(newAccount[key])
        : newAccount[key];
    }

    //console.log("BODY--->", JSON.stringify({ mailboxes: [body] }));

    //Make the secure server-to-server post request to Woodpecker
    const wpResponse = await fetch(
      `${WOODPECKER_API_URL}/v2/mailboxes/manual_connection/bulk`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use the API key received from the client for authorization
          "x-api-key": `${apiKey}`,
        },
        //add body here:
        body: JSON.stringify({ mailboxes: [body] }),
      }
    );

    //Handle Woodpecker's response status
    if (!wpResponse.ok) {
      const errorData = await wpResponse.json();
      // Forward the error status/message from Woodpecker to the client
      return NextResponse.json(errorData, { status: wpResponse.status });
    }

    //The response includes a batch_id that allows to monitor the progress and results of the submitted mailbox connections
    const data = await wpResponse.json();
    const { batch_id } = data;

    const wpChekEmailBoxStatus = await fetch(
      `${WOODPECKER_API_URL}/v2/mailboxes/manual_connection/bulk/${batch_id}/summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Use the API key received from the client for authorization
          "x-api-key": `${apiKey}`,
        },
      }
    );

    //Handle Woodpecker's response status
    if (!wpChekEmailBoxStatus.ok) {
      const errorData = await wpResponse.json();
      // Forward the error status/message from Woodpecker to the client
      return NextResponse.json(errorData, { status: wpResponse.status });
    }
    const email_box = await wpChekEmailBoxStatus.json();
    email_box["statusCode"] = wpResponse.status;
    email_box["status"] = email_box.failed_mailboxes_count === 0 ? "OK" : "KO";
    email_box["body"] = body;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
