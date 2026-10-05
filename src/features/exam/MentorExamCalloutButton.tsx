"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MentorExamCalloutButtonProps {
  className?: string;
}

export default function MentorExamCalloutButton({
  className,
}: MentorExamCalloutButtonProps) {
  const router = useRouter();
  const { user, isAuthenticated, role } = useAuthContext();

  const handleClick = () => {
    // 1. If unauthenticated, redirect to login
    if (!isAuthenticated || !user) {
      toast.info("Please sign in as a mentor to create exams.", {
        description: "Are you an experienced engineer? You can apply to become a verified mentor.",
      });
      router.push("/login?redirectTo=/mentor/exams/new");
      return;
    }

    // 2. If user is a mentor or admin, allow navigation to exam builder
    if (role === "mentor" || role === "admin") {
      router.push("/mentor/exams/new");
      return;
    }

    // 3. If user is a student, show helpful toast message advising them only mentors can create exams
    toast.error("Only verified mentors can create and publish exams.", {
      description:
        "Want to become a DevMentor instructor? Submit an application or explore mentorship opportunities.",
      action: {
        label: "Become a Mentor",
        onClick: () => router.push("/mentors"),
      },
      duration: 6000,
    });
  };

  return (
    <Button
      onClick={handleClick}
      className={
        className ||
        "bg-amber text-white hover:bg-amber-hover font-semibold shrink-0 cursor-pointer shadow-xs"
      }
    >
      Open Exam Builder <ArrowRight className="size-4 ml-1.5" />
    </Button>
  );
}
