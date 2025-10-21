import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://beyuvana.com/api";
const isDevelopment = process.env.NODE_ENV === "development";

async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing endpoint parameter" },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    if (!headers["content-type"] && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }



    const queryParams = new URLSearchParams(searchParams);
    queryParams.delete("endpoint");
    const url = `${API_BASE_URL}${endpoint}${queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;

    let body: string | undefined = undefined;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.text();

      // Log user ID from request body if present
      try {
        const bodyData = JSON.parse(body);
        if (bodyData.user_id) {
        }
      } catch {
        // Body might not be JSON, ignore
      }
    }


    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    });


    const textData = await response.text();

    const forwardHeaders = new Headers();

    const contentType = response.headers.get("content-type");
    if (contentType) {
      forwardHeaders.set("content-type", contentType);
    } else {
      forwardHeaders.set("content-type", "application/json");
    }

    const setCookie = response.headers.getSetCookie?.() as string[] | undefined;
    if (Array.isArray(setCookie) && setCookie.length > 0) {
      for (const cookie of setCookie) {
        forwardHeaders.append("set-cookie", cookie);
      }
    } else {
      const rawSetCookie = response.headers.get("set-cookie");
      if (rawSetCookie) {
        forwardHeaders.append("set-cookie", rawSetCookie);
      }
    }


    return new NextResponse(textData, {
      status: response.status,
      headers: forwardHeaders,
    });
  } catch (error) {
    if (isDevelopment) {
      console.error("❌ Proxy error:", error);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
