import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync"; // Use the synchronous version
import { getDateAndTime } from "@/utils/helper";

// Define the expected CSV record type
interface CsvRecord {
  email: string;
  status: string;
  first_name: string;
  last_name: string;
  company: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  industry: string;
  website: string;
  [key: string]: any;
}

export async function POST(req: Request) {
  try {
    // 1. Process the multipart/form-data
    const formData = await req.formData();
    const fileEntry = formData.get("csvFile");
    const apiKey = formData.get("apiKey");
    const campaignId = formData.get("campaignId");

    // 2. Validate essential data (Optional but good practice)
    if (!apiKey || !campaignId) {
      return NextResponse.json(
        { message: `Missing parameters ${!apiKey ? "apiKey" : "campaignId"}` },
        { status: 400 }
      );
    }
    if (!fileEntry || typeof fileEntry === "string") {
      return NextResponse.json(
        { message: "No file uploaded or incorrect key." },
        { status: 400 }
      );
    }

    const file = fileEntry as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Node.js Buffer
    const csvTextContent = buffer.toString("utf8"); // Convert Buffer to string

    const records: CsvRecord[] = parse(csvTextContent, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        if (context.column === "price") {
          const num = parseFloat(value);
          return isNaN(num) ? 0 : num;
        }
        return value;
      },
    }) as CsvRecord[];

    const time = getDateAndTime(new Date(), false);

    const body = {
      campaign: {
        campaign_id: campaignId,
      },
      file_name: `API import ${time}`,
      prospects: records,
    };

    //console.log("RECORDS--->", records);

    //return NextResponse.json(body, { status: 200 });

    //Make the secure server-to-server post request to Woodpecker
    const wpResponse = await fetch(
      `${process.env.API_SRV_ROOT}/v1/add_prospects_campaign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use the API key received from the client for authorization
          "x-api-key": `${apiKey}`,
        },
        // add body here:
        body: JSON.stringify(body),
      }
    );

    // 6. Handle Woodpecker's response status
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
      return NextResponse.json(data, { status: 200 });
    }

    // 7. Success: Forward the data to the client

    return NextResponse.json(
      {
        message: "CSV processed successfully!",
        count: records.length,
        status: "OK",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("File Upload/Processing Error:", error.message);
      return NextResponse.json(
        { message: `Server error: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown server error occurred." },
      { status: 500 }
    );
  }
}
