"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";
import type { AuthUser, AuthSession } from "@/types/auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  isPending: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  role: AuthUser["role"] | null;
  refetch: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending, error, refetch } = authClient.useSession();

  const user = (data?.user as unknown as AuthUser) || null;
  const session = (data?.session as unknown as AuthSession) || null;

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isPending,
      error: error ? new Error(error.message || "Authentication error") : null,
      isAuthenticated: Boolean(user),
      role: user?.role || null,
      refetch: async () => {
        await refetch();
      },
    }),
    [user, session, isPending, error, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
