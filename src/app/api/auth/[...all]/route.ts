import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dev-mentor-server.vercel.app";

async function proxyHandler(req: NextRequest) {
  const url = new URL(req.url);
  // Forward to backend: e.g. /api/auth/sign-in/email -> /api/v1/auth/sign-in/email
  const backendAuthPath = url.pathname.replace(/^\/api\/auth/, "/api/v1/auth");
  const targetUrl = `${BACKEND_URL}${backendAuthPath}${url.search}`;

  const headers = new Headers(req.headers);
  headers.set("host", new URL(BACKEND_URL).host);
  headers.set("origin", "http://localhost:3000");
  // Request uncompressed response from backend so Next.js doesn't forward mismatched compressed stream
  headers.set("accept-encoding", "identity");

  // If browser sends better-auth.session_token, ensure the backend receives __Secure-better-auth.session_token
  const incomingCookie = headers.get("cookie") || "";
  if (incomingCookie.includes("better-auth.session_token=") && !incomingCookie.includes("__Secure-better-auth.session_token=")) {
    const tokenMatch = incomingCookie.match(/better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      headers.set("cookie", `${incomingCookie}; __Secure-better-auth.session_token=${tokenMatch[1]}`);
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  const backendResponse = await fetch(targetUrl, init);

  const resHeaders = new Headers();
  // Copy safe headers from backend response
  const contentType = backendResponse.headers.get("content-type");
  if (contentType) resHeaders.set("content-type", contentType);

  // Rewriting set-cookie to ensure cookies work on localhost without Secure/Domain conflicts:
  const setCookies = backendResponse.headers.getSetCookie();
  if (setCookies && setCookies.length > 0) {
    for (const cookieStr of setCookies) {
      let cleaned = cookieStr
        .replace(/__Secure-/g, "")
        .replace(/Domain=[^;]+;?/gi, "");

      if (url.protocol === "http:") {
        cleaned = cleaned.replace(/Secure;?/gi, "");
      }
      resHeaders.append("set-cookie", cleaned);
    }
  }

  const responseText = await backendResponse.text();

  return new NextResponse(responseText, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: resHeaders,
  });
}

export {
  proxyHandler as GET,
  proxyHandler as POST,
  proxyHandler as PUT,
  proxyHandler as DELETE,
  proxyHandler as PATCH,
};
