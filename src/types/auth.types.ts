export type UserRole = "student" | "mentor" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  isBlocked?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuthSession {
  id: string;
  token: string;
  userId: string;
  expiresAt: string | Date;
}

export interface UserSession {
  user: AuthUser;
  session: AuthSession;
}
