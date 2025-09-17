export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const rawBase = process.env.NEXT_PUBLIC_API_URL;
    if (!rawBase) {
        throw new Error("NEXT_PUBLIC_API_URL is not set. Add it to .env.local and restart the dev server.");
    }
    const baseUrl = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "API request failed");
    }

    return res.json();
}
