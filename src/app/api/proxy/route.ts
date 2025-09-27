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

    if (isDevelopment) {
      console.log(`📋 Headers being forwarded:`, headers);
      console.log(
        `🔍 Debug - Original request headers:`,
        Object.fromEntries(request.headers.entries())
      );
      console.log(`🔍 Debug - Endpoint: ${endpoint}`);
    }

    // Build full URL with query params (excluding "endpoint" itself)
    const queryParams = new URLSearchParams(searchParams);
    queryParams.delete("endpoint");
    const url = `${API_BASE_URL}${endpoint}${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    // Forward body for methods like POST, PUT, PATCH
    let body: string | undefined = undefined;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.text();
    }

    if (isDevelopment) {
      console.log(`🔄 Proxying ${request.method} request to:`, url);
      console.log(`📤 Request body:`, body);
      console.log(`📤 Final headers being sent:`, headers);
    }

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    });

    if (isDevelopment) {
      console.log(`📡 Backend response status:`, response.status);
      console.log(
        `📡 Backend response headers:`,
        Object.fromEntries(response.headers.entries())
      );
    }

    // Try parsing JSON, fallback to text
    let data;
    const textData = await response.text();
    try {
      data = JSON.parse(textData);
    } catch {
      data = textData;
    }

    if (isDevelopment) {
      console.log(`✅ Proxy response for ${endpoint}:`, {
        status: response.status,
        data,
        responseHeaders: Object.fromEntries(response.headers.entries()),
      });
    }

    return NextResponse.json(data, { status: response.status });
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
