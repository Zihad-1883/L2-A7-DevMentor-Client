"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Code2,
  Award,
  Send,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  UploadCloud,
  FileCode,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { mentorService } from "@/services/mentor.service";
import { uploadService } from "@/services/upload.service";

const POPULAR_SKILLS = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "PostgreSQL",
  "Prisma",
  "Docker",
  "Kubernetes",
  "Go",
  "Python",
  "System Design",
  "GraphQL",
];

export default function MentorApplicationForm() {
  const router = useRouter();
  const { user, isAuthenticated, role } = useAuthContext();

  const [bio, setBio] = React.useState("");
  const [experienceLevel, setExperienceLevel] = React.useState<
    "JUNIOR" | "MID" | "SENIOR"
  >("MID");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([
    "Node.js",
    "TypeScript",
  ]);
  const [customTagInput, setCustomTagInput] = React.useState("");
  const [githubUrl, setGithubUrl] = React.useState("");
  const [resumeUrl, setResumeUrl] = React.useState("");
  const [isUploadingResume, setIsUploadingResume] = React.useState(false);
  const [resumeFileName, setResumeFileName] = React.useState("");
  const resumeFileInputRef = React.useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedSuccess, setSubmittedSuccess] = React.useState(false);

  const handleResumeFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume file exceeds maximum allowed size (10 MB).");
      return;
    }

    setIsUploadingResume(true);
    try {
      const res = await uploadService.uploadFile(file);
      setResumeUrl(res.url);
      setResumeFileName(file.name);
      toast.success(`Uploaded ${file.name} to Cloudinary!`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload resume. Please try again.";
      toast.error(message);
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleRemoveResume = () => {
    setResumeUrl("");
    setResumeFileName("");
    if (resumeFileInputRef.current) resumeFileInputRef.current.value = "";
  };

  // 1. If user is already a mentor, inform and let them go to mentor hub
  if (isAuthenticated && role === "mentor") {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border shadow-xs text-center max-w-xl mx-auto space-y-4">
        <div className="size-14 rounded-2xl bg-emerald-light text-emerald flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-text-primary">
          You are Already an Approved Mentor!
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Your mentor account is active. You can browse open student sprints, host cohorts, and publish practice exams directly from your mentor hub.
        </p>
        <div className="pt-2">
          <Button
            onClick={() => router.push("/mentor")}
            className="bg-amber text-white hover:bg-amber-hover font-semibold"
          >
            Go to Mentor Dashboard <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>
      </div>
    );
  }

  // 2. If user is not authenticated, prompt to sign in or register first
  if (!isAuthenticated) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border shadow-xs text-center max-w-xl mx-auto space-y-4">
        <div className="size-14 rounded-2xl bg-amber-light text-amber flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="size-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-text-primary">
          Sign In as a Student to Apply
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          You need an active DevMentor student account to link your mentor application and credentials. Please sign in or create an account to proceed.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => router.push("/login?redirectTo=/apply-mentor")}
            className="w-full sm:w-auto bg-amber text-white hover:bg-amber-hover font-semibold px-6"
          >
            Sign In to Continue
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/register?redirectTo=/apply-mentor")}
            className="w-full sm:w-auto font-semibold px-6"
          >
            Create Free Account
          </Button>
        </div>
      </div>
    );
  }

  // 3. Admin account notice
  if (role === "admin") {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border shadow-xs text-center max-w-xl mx-auto space-y-4">
        <div className="size-14 rounded-2xl bg-surface-raised text-text-muted flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="size-8 text-amber" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-text-primary">
          Administrator Account
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          You are currently logged in with Platform Administrator privileges. Mentor applications must be submitted by student accounts.
        </p>
        <div className="pt-2">
          <Button
            onClick={() => router.push("/admin")}
            className="bg-amber text-white hover:bg-amber-hover font-semibold"
          >
            Go to Admin Console
          </Button>
        </div>
      </div>
    );
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customTagInput.trim()) {
      e.preventDefault();
      const trimmed = customTagInput.trim();
      if (!selectedTags.includes(trimmed)) {
        setSelectedTags((prev) => [...prev, trimmed]);
      }
      setCustomTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in as a student to apply as a mentor.", {
        description: "You need an active DevMentor account to link your application.",
      });
      router.push("/login?redirectTo=/mentor/apply");
      return;
    }

    if (bio.trim().length < 20) {
      toast.error("Please provide a more detailed bio (minimum 20 characters).");
      return;
    }

    if (selectedTags.length === 0) {
      toast.error("Please select or add at least one tech stack specialization.");
      return;
    }

    if (!resumeUrl.trim()) {
      toast.error("Please provide a valid portfolio or resume link (Google Drive / LinkedIn / PDF).");
      return;
    }

    setIsSubmitting(true);

    try {
      await mentorService.applyForMentor({
        bio: bio.trim(),
        techStackTags: selectedTags,
        experienceLevel,
        githubUrl: githubUrl.trim() || null,
        resumeUrl: resumeUrl.trim(),
      });

      toast.success("Application submitted successfully!", {
        description: "Redirecting to your pending verification tracker...",
      });

      router.push("/mentor/pending");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : null;
      toast.error(msg || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-emerald/30 shadow-md text-center max-w-xl mx-auto space-y-4 animate-in fade-in duration-300">
        <div className="size-16 rounded-2xl bg-emerald-light text-emerald flex items-center justify-center mx-auto shadow-xs">
          <Clock className="size-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-light text-emerald border border-emerald/20 inline-block">
          Application Pending Admin Review
        </span>
        <h2 className="font-serif text-3xl font-bold text-text-primary">
          Thank you for applying, {user?.name || "Engineer"}!
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          We have received your mentorship application. Our engineering team conducts review audits within 24-48 hours. Once approved, you will unlock full mentor access.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => router.push("/mentor/pending")}
            className="bg-amber text-white hover:bg-amber-hover font-semibold text-xs"
          >
            Track Status on /mentor/pending <ArrowRight className="size-3.5 ml-1.5" />
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="text-xs"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 sm:p-10 rounded-3xl bg-surface border border-border shadow-xs space-y-8"
    >
      {/* Bio section */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-text-primary flex items-center justify-between">
          <span>Engineering Biography &amp; Background</span>
          <span className="text-xs text-text-muted font-normal">
            {bio.length}/1000 chars (min 20)
          </span>
        </label>
        <textarea
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Describe your current software engineering experience, favorite architectural domains, and why you want to guide fellow developers..."
          className="w-full p-4 rounded-xl border border-border bg-surface-raised/40 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all resize-none"
          required
        />
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-text-primary block">
          Current Experience Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["JUNIOR", "MID", "SENIOR"] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setExperienceLevel(lvl)}
              className={`p-3.5 rounded-xl border text-xs font-semibold tracking-wide transition-all cursor-pointer ${experienceLevel === lvl
                ? "bg-amber text-white border-amber shadow-xs"
                : "bg-surface-raised text-text-secondary border-border hover:border-text-muted"
                }`}
            >
              {lvl === "JUNIOR"
                ? "Junior (1-2 yrs)"
                : lvl === "MID"
                  ? "Mid-Level (3-5 yrs)"
                  : "Senior (5+ yrs)"}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Stack Tags */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-text-primary flex items-center justify-between">
          <span>Primary Technologies &amp; Specialties</span>
          <span className="text-xs text-text-muted font-normal">
            {selectedTags.length} selected
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SKILLS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${isSelected
                  ? "bg-amber text-white border border-amber font-semibold shadow-xs"
                  : "bg-surface-raised text-text-secondary border border-border hover:text-text-primary hover:border-text-muted"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Custom Tag input */}
        <div className="pt-2">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            onKeyDown={handleAddCustomTag}
            placeholder="Type other technology (e.g. AWS, Redis, Rust) and press Enter..."
            className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface-raised/40 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber"
          />
        </div>
      </div>

      {/* Links & Verification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
            <Code2 className="size-3.5 text-text-muted" /> GitHub Profile URL
          </label>
          <Input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/yourusername"
            className="h-10 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <FileText className="size-3.5 text-text-muted" /> Resume / CV / Portfolio *
            </label>
            <input
              type="file"
              ref={resumeFileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleResumeFileUpload(file);
              }}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => resumeFileInputRef.current?.click()}
              disabled={isUploadingResume}
              className="text-[11px] font-semibold text-amber hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isUploadingResume ? (
                <>
                  <Loader2 className="size-3 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="size-3" /> Upload PDF / Doc
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <Input
              type="url"
              value={resumeUrl}
              onChange={(e) => {
                setResumeUrl(e.target.value);
                setResumeFileName("");
              }}
              placeholder="https://drive.google.com/... or upload PDF above"
              className="h-10 text-xs pr-8"
              required
            />
            {resumeUrl && (
              <button
                type="button"
                onClick={handleRemoveResume}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-rose cursor-pointer"
                title="Clear"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>

          {resumeFileName && (
            <p className="text-[11px] text-emerald font-semibold flex items-center gap-1">
              <CheckCircle2 className="size-3" /> Uploaded: {resumeFileName}
            </p>
          )}
        </div>
      </div>

      {/* Trust Notice */}
      <div className="p-4 rounded-xl bg-surface-raised border border-border/80 flex items-start gap-3 text-xs text-text-secondary">
        <ShieldCheck className="size-4 text-emerald mt-0.5 shrink-0" />
        <span>
          Applications are screened for authentic industry experience. Once an administrator validates your profile, you will gain access to sprint claim pools, cohort publishing, and direct credit payouts.
        </span>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-amber text-white hover:bg-amber-hover font-semibold text-sm shadow-md cursor-pointer gap-2"
        >
          <Send className="size-4" />
          {isSubmitting ? "Submitting Application..." : "Submit Application for Review"}
        </Button>
      </div>
    </form>
  );
}
