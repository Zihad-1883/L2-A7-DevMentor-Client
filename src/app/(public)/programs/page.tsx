// Redirect /programs to /cohorts or export ProgramsPage
import { redirect } from "next/navigation";

export default function ProgramsPage() {
  redirect("/cohorts");
}
