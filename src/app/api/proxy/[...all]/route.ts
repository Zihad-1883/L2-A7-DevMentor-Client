import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dev-mentor-server.vercel.app";

async function proxyHandler(req: NextRequest) {
  const url = new URL(req.url);
  // Forward e.g. /api/proxy/mentors/apply -> https://dev-mentor-server.vercel.app/api/v1/mentors/apply
  const targetPath = url.pathname.replace(/^\/api\/proxy/, "/api/v1");
  const targetUrl = `${BACKEND_URL}${targetPath}${url.search}`;

  const incomingCookie = req.headers.get("cookie") || "";
  let forwardedCookie = incomingCookie;
  if (
    incomingCookie.includes("better-auth.session_token=") &&
    !incomingCookie.includes("__Secure-better-auth.session_token=")
  ) {
    const tokenMatch = incomingCookie.match(/better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      forwardedCookie += `; __Secure-better-auth.session_token=${tokenMatch[1]}`;
    }
  }

  // Construct request headers
  const forwardHeaders: Record<string, string> = {
    cookie: forwardedCookie,
    origin: "http://localhost:3000",
    "content-type": req.headers.get("content-type") || "application/json",
  };

  console.log(`[API Proxy] ${req.method} ${targetUrl} | cookie: ${forwardedCookie.slice(0, 50)}...`);

  const init: RequestInit = {
    method: req.method,
    headers: forwardHeaders,
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  const backendResponse = await fetch(targetUrl, init);
  const responseText = await backendResponse.text();
  console.log(`[API Proxy Debug] status: ${backendResponse.status}, body: ${responseText.slice(0, 200)}`);
  console.log(`[API Proxy Debug] sent headers:`, forwardHeaders);

  const resHeaders = new Headers();
  const contentType = backendResponse.headers.get("content-type");
  if (contentType) resHeaders.set("content-type", contentType);

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
