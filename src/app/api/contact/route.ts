import { NextRequest, NextResponse } from "next/server";
import { ENV_CONFIG } from "@/lib/constants";

const MAILFORM_URL = ENV_CONFIG.MAILFORM_URL?.replace(/\/$/, "") ?? "";
// In this project, the legacy PHP handler is `sendmail.php`.
const MAILFORM_ENDPOINT = `${MAILFORM_URL}/sendmail.php`;

export async function POST(request: NextRequest) {
  if (!MAILFORM_URL) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Mail form is not configured. Set MAILFORM_URL or NEXT_PUBLIC_MAILFORM_URL (e.g. http://localhost:8080 for dev).",
      },
      { status: 503 }
    );
  }

  try {
    const contentType =
      request.headers.get("content-type") || "application/x-www-form-urlencoded";
    const body = await request.text();

    const response = await fetch(MAILFORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body,
    });

    const text = await response.text();
    const resHeaders = new NextResponse().headers;
    resHeaders.set("Content-Type", "application/json; charset=utf-8");

    if (!response.ok) {
      let data: { success?: boolean; message?: string } = {
        success: false,
        message: "Failed to send message. Please try again.",
      };
      try {
        const parsed = JSON.parse(text);
        if (parsed?.message) data.message = parsed.message;
        if (typeof parsed?.success === "boolean") data.success = parsed.success;
      } catch {
        if (text) data.message = text.slice(0, 200);
      }
      return NextResponse.json(data, {
        status: response.status >= 400 ? response.status : 500,
      });
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ success: true, status: true });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    const isNetwork =
      message.includes("fetch") ||
      message.includes("ECONNREFUSED") ||
      message.includes("ENOTFOUND");

    return NextResponse.json(
      {
        success: false,
        message: isNetwork
          ? "Cannot reach mail server. For local dev, run: php -S localhost:8080 sendmail.php in the `app` folder and set MAILFORM_URL=http://localhost:8080"
          : "Failed to submit form. Please try again.",
      },
      { status: 502 }
    );
  }
}
