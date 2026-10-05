import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000",
  basePath: "/api/v1/auth",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
