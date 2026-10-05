// Next.js Proxy (replaces middleware.ts in Next.js 16 for network request proxying & route guards)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserRole, UserSession } from "@/types/auth.types";

const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  student: "/dashboard",
  mentor: "/mentor",
  admin: "/admin",
};

/**
 * Validates session against the Better Auth backend endpoint
 * by forwarding incoming request cookie headers.
 */
async function fetchSession(req: NextRequest): Promise<UserSession | null> {
  const cookieHeader = req.headers.get("cookie") || "";
  if (!cookieHeader) return null;

  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const res = await fetch(`${backendUrl}/api/v1/auth/get-session`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = (await res.json()) as UserSession | null;
    if (data?.user && data?.session) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Identify protected route types
  const isStudentRoute = pathname.startsWith("/dashboard");
  const isMentorRoute = pathname.startsWith("/mentor");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute = isStudentRoute || isMentorRoute || isAdminRoute;

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Retrieve authenticated session from backend
  const sessionData = await fetchSession(req);
  const user = sessionData?.user;

  // 1. Unauthenticated users -> Redirect to /login with redirectTo
  if (!user) {
    const loginUrl = new URL("/login", req.url);
    const returnUrl = `${pathname}${search}`;
    loginUrl.searchParams.set("redirectTo", returnUrl);
    return NextResponse.redirect(loginUrl);
  }

  const role = user.role;

  // 2. Guard /dashboard/* (Requires student)
  if (isStudentRoute && role !== "student") {
    const target = ROLE_DEFAULT_ROUTES[role] || "/";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 3. Guard /mentor/* (Requires mentor)
  if (isMentorRoute && role !== "mentor") {
    const target = ROLE_DEFAULT_ROUTES[role] || "/";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 4. Guard /admin/* (Requires admin)
  if (isAdminRoute && role !== "admin") {
    const target = ROLE_DEFAULT_ROUTES[role] || "/";
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/mentor/:path*",
    "/admin/:path*",
  ],
};
