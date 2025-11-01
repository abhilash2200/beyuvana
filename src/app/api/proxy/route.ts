import { NextRequest, NextResponse } from "next/server";

import { ENV_CONFIG } from "@/lib/constants";

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;
const isDevelopment = ENV_CONFIG.NODE_ENV === "development";

/**
 * Validates and sanitizes the endpoint to prevent SSRF attacks
 * @param endpoint - The endpoint path from the request
 * @returns Validated endpoint or null if invalid
 */
function validateEndpoint(endpoint: string | null): string | null {
  if (!endpoint) {
    return null;
  }

  // Remove any leading/trailing whitespace
  const trimmedEndpoint = endpoint.trim();

  // Must start with / to be a valid API path
  if (!trimmedEndpoint.startsWith("/")) {
    return null;
  }

  // Prevent path traversal attacks
  if (trimmedEndpoint.includes("..") || trimmedEndpoint.includes("//")) {
    return null;
  }

  // Only allow alphanumeric, slash, dash, underscore, and query string characters
  // This prevents injection of protocol schemes or special characters
  const validEndpointPattern = /^\/[a-zA-Z0-9\/\-_?=&.:]+$/;
  if (!validEndpointPattern.test(trimmedEndpoint)) {
    return null;
  }

  // Decode the endpoint to check for encoded attacks
  try {
    const decoded = decodeURIComponent(trimmedEndpoint);
    // Check for common SSRF indicators after decoding
    if (decoded.includes("http://") || decoded.includes("https://") || decoded.includes("ftp://")) {
      return null;
    }
    // Check for private IP ranges (common SSRF attack vector)
    if (/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(decoded)) {
      return null;
    }
  } catch {
    // If decoding fails, reject the endpoint
    return null;
  }

  return trimmedEndpoint;
}

async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawEndpoint = searchParams.get("endpoint");

    // Validate endpoint to prevent SSRF attacks
    const endpoint = validateEndpoint(rawEndpoint);
    if (!endpoint) {
      return NextResponse.json(
        { error: "Invalid or missing endpoint parameter" },
        { status: 400 }
      );
    }

    const allowedHeaders = [
      "content-type",
      "Content-Type",
      "authorization",
      "Authorization",
      "session_key",
      "sessionkey",
    ];

    const headers: Record<string, string> = {};

    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (allowedHeaders.some(allowed => allowed.toLowerCase() === lowerKey)) {
        headers[key] = value;
      }
    });

    if (!headers["content-type"] && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }



    // Safely construct the URL with validated endpoint
    const queryParams = new URLSearchParams(searchParams);
    queryParams.delete("endpoint");
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}${endpoint}${queryString ? "?" + queryString : ""}`;

    // Additional security: Verify the final URL is pointing to our API domain
    try {
      const urlObj = new URL(url);
      const baseUrlObj = new URL(API_BASE_URL);
      
      // Ensure the hostname matches the configured API base URL
      if (urlObj.hostname !== baseUrlObj.hostname && urlObj.hostname !== "") {
        if (isDevelopment) {
          console.error("SSRF attempt detected - hostname mismatch:", {
            requested: urlObj.hostname,
            expected: baseUrlObj.hostname,
          });
        }
        return NextResponse.json(
          { error: "Invalid request" },
          { status: 400 }
        );
      }
    } catch (urlError) {
      // If URL parsing fails, reject the request
      if (isDevelopment) {
        console.error("Invalid URL constructed:", urlError);
      }
      return NextResponse.json(
        { error: "Invalid request URL" },
        { status: 400 }
      );
    }

    let body: string | undefined = undefined;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.text();

      // Validate body size to prevent large payload attacks
      const MAX_BODY_SIZE = 10 * 1024 * 1024; // 10MB
      if (body.length > MAX_BODY_SIZE) {
        return NextResponse.json(
          { error: "Request body too large" },
          { status: 413 }
        );
      }

      // Optional: Validate JSON structure if needed
      try {
        JSON.parse(body);
      } catch (parseError) {
        if (isDevelopment) {
          console.error("Invalid JSON in request body:", parseError);
        }
        return NextResponse.json(
          { error: "Invalid JSON in request body" },
          { status: 400 }
        );
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
      console.error("Proxy error:", error);
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
