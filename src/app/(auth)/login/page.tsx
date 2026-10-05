import type { Metadata } from "next";
import LoginForm from "@/features/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — DevMentor",
  description: "Sign in to your DevMentor account to access sprints, cohorts, and code reviews.",
};

export default function LoginPage() {
  return <LoginForm />;
}
