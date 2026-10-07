"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { cohortService } from "@/services/cohort.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import ConfirmModal from "@/components/shared/ConfirmModal";

interface SmartEnrollButtonProps {
  cohortId: string;
  totalCost: number;
}

export default function SmartEnrollButton({
  cohortId,
  totalCost,
}: SmartEnrollButtonProps) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuthContext();
  const [isEnrolling, setIsEnrolling] = React.useState(false);
  const [isEnrolled, setIsEnrolled] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleEnrollClick = () => {
    // 1. If unauthenticated, redirect to login with return path
    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to enroll in this cohort.", {
        description: "Redirecting you to login...",
      });
      router.push(`/login?redirectTo=/cohorts/${cohortId}`);
      return;
    }

    // 2. Mentors/Admins cannot enroll as students
    if (role !== "student") {
      toast.error(`Signed in as ${role || "member"}.`, {
        description: "Only student accounts can enroll in group cohorts.",
        action: {
          label: "My Dashboard",
          onClick: () => router.push(role === "mentor" ? "/mentor" : "/admin"),
        },
      });
      return;
    }

    // 3. Open confirmation modal for authenticated student
    setIsConfirmOpen(true);
  };

  const executeEnrollment = async () => {
    setIsEnrolling(true);
    try {
      await cohortService.enrollInCohort(cohortId);
      setIsEnrolled(true);
      setIsConfirmOpen(false);
      toast.success("Successfully enrolled in this cohort!", {
        description:
          totalCost > 0
            ? `${totalCost} credits allocated to platform escrow. Check your student cohorts dashboard.`
            : "Free enrollment confirmed! Check your student cohorts dashboard.",
        action: {
          label: "View in Dashboard",
          onClick: () => router.push("/dashboard/cohorts"),
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : null;
      toast.error(msg || "Failed to enroll. Please verify you have sufficient wallet credits.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button
        size="lg"
        disabled
        className="w-full bg-emerald text-white font-semibold shadow-md py-6 text-sm opacity-90 cursor-default gap-2"
      >
        <CheckCircle2 className="size-4" /> Enrolled Successfully
      </Button>
    );
  }

  return (
    <>
      <Button
        size="lg"
        disabled={isEnrolling}
        onClick={handleEnrollClick}
        className="w-full bg-amber text-white hover:bg-amber-hover font-semibold shadow-md py-6 text-sm cursor-pointer disabled:opacity-75 gap-2"
      >
        {isEnrolling ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Processing Enrollment...</span>
          </>
        ) : (
          <span>
            {totalCost === 0 ? "Enroll Now · Free" : `Enroll Now · ${totalCost} Credits`}
          </span>
        )}
      </Button>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Cohort Enrollment?"
        description={
          totalCost > 0
            ? `Enrolling in this cohort will reserve your seat and transfer ${totalCost} credits (৳${totalCost * 4} BDT) from your DevWallet into platform escrow. Do you wish to proceed?`
            : "This is a free community cohort program. Confirm your enrollment to reserve your seat in the live workshop."
        }
        confirmLabel={totalCost > 0 ? `Enroll for ${totalCost} Credits` : "Confirm Free Enrollment"}
        variant="primary"
        isLoading={isEnrolling}
        onConfirm={executeEnrollment}
        onClose={() => setIsConfirmOpen(false)}
      />
    </>
  );
}
