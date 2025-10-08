import { NextRequest, NextResponse } from "next/server";

// Environment-based configuration with fallback
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

    // Prepare headers: forward all incoming headers (like Authorization)
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      // Preserve original header names but ensure they're properly formatted
      headers[key] = value;
    });

    // Ensure Content-Type is set if not present
    if (!headers["content-type"] && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }


    // Build full URL with query params (excluding "endpoint" itself)
    const queryParams = new URLSearchParams(searchParams);
    queryParams.delete("endpoint");
    const url = `${API_BASE_URL}${endpoint}${queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;

    // Forward body for methods like POST, PUT, PATCH
    let body: string | undefined = undefined;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.text();
    }


    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    });


    // Read upstream body as text (may be JSON). We'll forward it verbatim
    const textData = await response.text();

    // Prepare response headers and forward critical ones (e.g., Set-Cookie)
    const forwardHeaders = new Headers();

    // Preserve content type if provided by upstream
    const contentType = response.headers.get("content-type");
    if (contentType) {
      forwardHeaders.set("content-type", contentType);
    } else {
      // Default to JSON since most backend responses are JSON
      forwardHeaders.set("content-type", "application/json");
    }

    // Forward all Set-Cookie headers from upstream so auth cookies persist
    const setCookie = response.headers.getSetCookie?.() as string[] | undefined;
    if (Array.isArray(setCookie) && setCookie.length > 0) {
      for (const cookie of setCookie) {
        forwardHeaders.append("set-cookie", cookie);
      }
    } else {
      // Fallback for environments without getSetCookie()
      const rawSetCookie = response.headers.get("set-cookie");
      if (rawSetCookie) {
        forwardHeaders.append("set-cookie", rawSetCookie);
      }
    }


    // Return raw body with forwarded headers (cookies included)
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

// Export for all methods (GET, POST, etc.)
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
