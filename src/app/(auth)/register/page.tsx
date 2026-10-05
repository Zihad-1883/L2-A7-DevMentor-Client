import type { Metadata } from "next";
import RegisterForm from "@/features/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an Account — DevMentor",
  description:
    "Join DevMentor to get 1-on-1 sprint mentorship, cohort learning programs, and SLA-guaranteed code reviews.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
