import type { Metadata } from "next";
import CohortCreateWizard from "@/features/cohort/CohortCreateWizard";

export const metadata: Metadata = {
  title: "Create Cohort Program",
  description: "Design and launch an intensive mentor-led group cohort program.",
};

export default function NewCohortPage() {
  return <CohortCreateWizard />;
}
