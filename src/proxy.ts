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
  let forwardedCookie = cookieHeader;
  // If the browser sent better-auth.session_token, ensure the backend also sees __Secure-better-auth.session_token
  if (cookieHeader.includes("better-auth.session_token=") && !cookieHeader.includes("__Secure-better-auth.session_token=")) {
    const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      forwardedCookie += `; __Secure-better-auth.session_token=${tokenMatch[1]}`;
    }
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dev-mentor-server.vercel.app";

  try {
    const res = await fetch(`${backendUrl}/api/v1/auth/get-session`, {
      method: "GET",
      headers: {
        cookie: forwardedCookie,
        origin: "http://localhost:3000",
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

  // Identify auth routes: /login, /register, /forgot-password, /reset-password
  const isAuthRoute =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/forgot-password/") ||
    pathname === "/reset-password" ||
    pathname.startsWith("/reset-password/");

  // Identify protected dashboard route types
  const isStudentRoute = pathname.startsWith("/dashboard");
  const isMentorRoute = pathname.startsWith("/mentor");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute = isStudentRoute || isMentorRoute || isAdminRoute;

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Retrieve authenticated session from backend
  const sessionData = await fetchSession(req);
  const user = sessionData?.user;

  // 1. If user IS authenticated and trying to access an auth page (login, register, etc.) -> redirect to dashboard
  if (user && isAuthRoute) {
    const target = ROLE_DEFAULT_ROUTES[user.role] || "/dashboard";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 2. If user is NOT authenticated and trying to access a protected dashboard route -> redirect to login
  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    const returnUrl = `${pathname}${search}`;
    loginUrl.searchParams.set("redirectTo", returnUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (!user) {
    return NextResponse.next();
  }

  const role = user.role;

  // 3. Guard /dashboard/* (Requires student)
  if (isStudentRoute && role !== "student") {
    const target = ROLE_DEFAULT_ROUTES[role] || "/";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 4. Guard /apply-mentor (Student-only page: requires auth + student role)
  if (pathname === "/apply-mentor" || pathname.startsWith("/apply-mentor/")) {
    if (!user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirectTo", "/apply-mentor");
      return NextResponse.redirect(loginUrl);
    }
    if (role === "mentor") {
      return NextResponse.redirect(new URL("/mentor", req.url));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // 5. Guard /mentor/* (Requires mentor)
  if (isMentorRoute && role !== "mentor") {
    const target = ROLE_DEFAULT_ROUTES[role] || "/";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 6. Guard /admin/* (Requires admin)
  if (isAdminRoute && role !== "admin") {
    const target = ROLE_DEFAULT_ROUTES[role] || "/";
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/apply-mentor",
    "/dashboard/:path*",
    "/mentor/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
