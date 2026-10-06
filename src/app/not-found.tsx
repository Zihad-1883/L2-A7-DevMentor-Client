import Link from "next/link";
import { ArrowLeft, HelpCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="size-16 rounded-2xl bg-amber-light text-amber flex items-center justify-center mx-auto border border-amber/30">
          <HelpCircle className="size-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-text-primary tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            The resource or examination you requested could not be found or may have been archived.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full text-xs">
              <ArrowLeft className="size-3.5 mr-1.5" /> Back to Dashboard
            </Button>
          </Link>
          <Link href="/exams" className="w-full sm:w-auto">
            <Button className="w-full bg-amber text-white hover:bg-amber-hover text-xs">
              <GraduationCap className="size-3.5 mr-1.5" /> Browse Exams
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
