"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Code2,
  GitBranch,
  GitPullRequest,
  Zap,
  Sparkles,
  ShieldCheck,
  Coins,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  FileCode,
  Layers,
  Terminal,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";
import { codeReviewService } from "@/services/code-review.service";
import { queryKeys } from "@/lib/query-keys";
import {
  createCodeReviewFormSchema,
  type CreateCodeReviewFormData,
} from "@/lib/validations/code-review.schema";
import type { CodeReviewTier } from "@/types/code-review.types";

const PROGRAMMING_LANGUAGES = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "php", label: "PHP" },
  { value: "sql", label: "SQL / Database" },
  { value: "other", label: "Other / Shell" },
];

const CODE_TEMPLATES: Record<string, string> = {
  typescript: `// Paste your TypeScript function, component, or class here
interface UserSession {
  id: string;
  role: "student" | "mentor";
  expiresAt: Date;
}

export async function validateSession(token: string): Promise<UserSession | null> {
  // Roadblock: Encountering unexpected latency and race conditions during high concurrency
  return null;
}`,
  javascript: `// Paste your JavaScript code snippet here
async function processOrder(orderId, userId) {
  // Looking for performance optimizations and async error handling feedback
}`,
  python: `# Paste your Python code snippet here
def calculate_metrics(events: list) -> dict:
    \"\"\"Looking for feedback on memory footprint and algorithmic efficiency.\"\"\"
    pass`,
};

export default function CodeReviewRequestForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { balance, isLoading: isWalletLoading } = useWallet();

  // Form State
  const [tier, setTier] = React.useState<CodeReviewTier>("QUICK");
  const [submissionMode, setSubmissionMode] = React.useState<"snippet" | "github">("snippet");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [language, setLanguage] = React.useState("typescript");
  const [codeSnippet, setCodeSnippet] = React.useState(CODE_TEMPLATES.typescript);
  const [githubRepoUrl, setGithubRepoUrl] = React.useState("");
  const [branchName, setBranchName] = React.useState("main");
  const [specificFiles, setSpecificFiles] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  // Cost calculation: QUICK = 10 credits, DEEP = 50 credits
  const requiredCredits = tier === "QUICK" ? 10 : 50;
  const hasSufficientCredits = balance >= requiredCredits;

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    // Suggest template if current snippet is empty or matches default template
    if (!codeSnippet.trim() || Object.values(CODE_TEMPLATES).includes(codeSnippet)) {
      if (CODE_TEMPLATES[newLang]) {
        setCodeSnippet(CODE_TEMPLATES[newLang]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const formData: CreateCodeReviewFormData = {
      tier,
      title,
      description,
      submissionMode,
      language,
      codeSnippet: submissionMode === "snippet" ? codeSnippet : undefined,
      githubRepoUrl: submissionMode === "github" ? githubRepoUrl : undefined,
      branchName: submissionMode === "github" ? branchName : undefined,
      specificFiles: specificFiles.trim() || undefined,
    };

    // Validate with Zod
    const validationResult = createCodeReviewFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (fieldName && !errors[fieldName]) {
          errors[fieldName] = issue.message;
        }
      });
      setFieldErrors(errors);
      toast.error("Please resolve the highlighted form errors.");
      return;
    }

    if (!hasSufficientCredits) {
      toast.error(
        `Insufficient DevWallet balance. Required: ${requiredCredits} credits (Available: ${balance} credits).`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await codeReviewService.createRequest({
        tier: formData.tier,
        title: formData.title,
        description: formData.description,
        language: formData.language,
        codeSnippet: formData.codeSnippet,
        githubRepoUrl: formData.githubRepoUrl || undefined,
        branchName: formData.branchName || "main",
        specificFiles: formData.specificFiles,
      });

      toast.success(
        `${tier === "QUICK" ? "Quick" : "Deep Architecture"} Code Review request submitted! ${requiredCredits} credits held in escrow.`
      );

      // Invalidate queries so dashboards update immediately
      queryClient.invalidateQueries({ queryKey: queryKeys.codeReviews.myRequests() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.me });

      router.push("/dashboard/code-reviews");
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        apiErr?.response?.data?.message || apiErr?.message || "Failed to submit code review request.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* 1. Review Tier Selection Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="size-3.5 text-amber" /> 1. Select Review Tier & Scope
          </label>
          <span className="text-xs text-text-muted">
            Escrow hold placed upon submission
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Review (10 credits) */}
          <div
            onClick={() => setTier("QUICK")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              tier === "QUICK"
                ? "bg-surface-raised/90 border-amber ring-2 ring-amber/20 shadow-xs"
                : "bg-surface border-border hover:border-border/80 hover:bg-surface-raised/40"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-light text-amber border border-amber/20 inline-flex items-center gap-1">
                  <Zap className="size-3" /> Quick Review
                </span>
                <div className="flex items-baseline gap-1 text-text-primary">
                  <span className="font-serif text-lg font-bold">10</span>
                  <span className="text-[11px] font-semibold text-text-muted">Credits</span>
                </div>
              </div>

              <h4 className="font-serif text-base font-bold text-text-primary">
                Specific Bug & Snippet Critique
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Focused feedback on isolated algorithms, error handling, syntax gotchas, or 1–2 specific functions.
              </p>

              <div className="pt-2 text-[11px] text-text-muted space-y-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald" /> Line-by-line inline annotations
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald" /> Refactored snippet recommendations
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-text-muted">Target SLA Delivery</span>
              <span className="font-bold text-emerald">2 Hours Guaranteed</span>
            </div>
          </div>

          {/* Deep Architectural Review (50 credits) */}
          <div
            onClick={() => setTier("DEEP")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              tier === "DEEP"
                ? "bg-surface-raised/90 border-amber ring-2 ring-amber/20 shadow-xs"
                : "bg-surface border-border hover:border-border/80 hover:bg-surface-raised/40"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20 inline-flex items-center gap-1">
                  <Sparkles className="size-3" /> Deep Architectural
                </span>
                <div className="flex items-baseline gap-1 text-text-primary">
                  <span className="font-serif text-lg font-bold">50</span>
                  <span className="text-[11px] font-semibold text-text-muted">Credits</span>
                </div>
              </div>

              <h4 className="font-serif text-base font-bold text-text-primary">
                Full PR & Architecture Audit
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Comprehensive security, scaling, clean code patterns, database query performance, and architecture audit.
              </p>

              <div className="pt-2 text-[11px] text-text-muted space-y-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald" /> Loom / Cloudinary video walkthrough
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald" /> GitHub PR review or branch refactor
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-text-muted">Target SLA Delivery</span>
              <span className="font-bold text-emerald">24 Hours Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Review Title & Context */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
        <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="size-3.5 text-amber" /> 2. Request Details & Roadblock
        </label>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary">
            Review Title <span className="text-rose">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) setFieldErrors((p) => ({ ...p, title: "" }));
            }}
            placeholder="e.g. Optimize Prisma nested joins & reduce N+1 query latency in dashboard API"
            className={`h-11 bg-background text-sm ${
              fieldErrors.title ? "border-rose focus-visible:ring-rose/20" : ""
            }`}
          />
          {fieldErrors.title ? (
            <p className="text-xs text-rose flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" /> {fieldErrors.title}
            </p>
          ) : (
            <p className="text-[11px] text-text-muted">
              Summarize your goal, problem statement, or the feature being reviewed.
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary">
            Description & Key Concerns <span className="text-rose">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (fieldErrors.description) setFieldErrors((p) => ({ ...p, description: "" }));
            }}
            placeholder="Explain what specific challenges you're experiencing, edge cases you worry about, or performance goals you want to hit..."
            className={`w-full p-3.5 rounded-xl border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 transition-all resize-y ${
              fieldErrors.description
                ? "border-rose focus:ring-rose/20"
                : "border-border focus:border-amber focus:ring-amber/20"
            }`}
          />
          {fieldErrors.description && (
            <p className="text-xs text-rose flex items-center gap-1">
              <AlertCircle className="size-3" /> {fieldErrors.description}
            </p>
          )}
        </div>
      </div>

      {/* 3. Code Submission: Snippet vs GitHub Repo */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Code2 className="size-3.5 text-amber" /> 3. Code Submission
          </label>

          {/* Toggle Button Group */}
          <div className="inline-flex p-1 rounded-xl bg-surface-raised border border-border self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setSubmissionMode("snippet");
                setFieldErrors((p) => ({ ...p, codeSnippet: "", githubRepoUrl: "" }));
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                submissionMode === "snippet"
                  ? "bg-surface text-text-primary shadow-2xs font-bold"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <FileCode className="size-3.5" /> Direct Snippet
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmissionMode("github");
                setFieldErrors((p) => ({ ...p, codeSnippet: "", githubRepoUrl: "" }));
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                submissionMode === "github"
                  ? "bg-surface text-text-primary shadow-2xs font-bold"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <GitPullRequest className="size-3.5" /> GitHub Repository
            </button>
          </div>
        </div>

        {/* MODE A: DIRECT SNIPPET */}
        {submissionMode === "snippet" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-primary">Language:</span>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-amber/20 cursor-pointer"
                >
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[11px] text-text-muted">
                Paste the specific file or logic causing issues
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="relative rounded-2xl overflow-hidden border border-border/90 bg-[#1e1e1e] shadow-xs">
                {/* Editor Header Bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3c3c3c] text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-rose-400/80 inline-block" />
                    <span className="size-2.5 rounded-full bg-amber-400/80 inline-block" />
                    <span className="size-2.5 rounded-full bg-emerald-400/80 inline-block" />
                    <span className="ml-2 font-mono text-[11px] text-neutral-300">
                      snippet.{language === "typescript" ? "ts" : language === "javascript" ? "js" : "code"}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 uppercase">
                    {language}
                  </span>
                </div>

                <textarea
                  rows={12}
                  value={codeSnippet}
                  onChange={(e) => {
                    setCodeSnippet(e.target.value);
                    if (fieldErrors.codeSnippet) setFieldErrors((p) => ({ ...p, codeSnippet: "" }));
                  }}
                  className="w-full p-4 font-mono text-xs text-neutral-100 bg-[#1e1e1e] focus:outline-none resize-y leading-relaxed"
                  placeholder="Paste your source code here..."
                  spellCheck={false}
                />
              </div>

              {fieldErrors.codeSnippet && (
                <p className="text-xs text-rose flex items-center gap-1 mt-1">
                  <AlertCircle className="size-3" /> {fieldErrors.codeSnippet}
                </p>
              )}
            </div>
          </div>
        )}

        {/* MODE B: GITHUB REPO */}
        {submissionMode === "github" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                <GitPullRequest className="size-3.5 text-text-muted" /> GitHub Repository URL{" "}
                <span className="text-rose">*</span>
              </label>
              <Input
                value={githubRepoUrl}
                onChange={(e) => {
                  setGithubRepoUrl(e.target.value);
                  if (fieldErrors.githubRepoUrl) setFieldErrors((p) => ({ ...p, githubRepoUrl: "" }));
                }}
                placeholder="https://github.com/your-username/your-repository"
                className={`h-11 bg-background text-sm font-mono ${
                  fieldErrors.githubRepoUrl ? "border-rose focus-visible:ring-rose/20" : ""
                }`}
              />
              {fieldErrors.githubRepoUrl ? (
                <p className="text-xs text-rose flex items-center gap-1 mt-1">
                  <AlertCircle className="size-3" /> {fieldErrors.githubRepoUrl}
                </p>
              ) : (
                <p className="text-[11px] text-text-muted">
                  Make sure the repository is public or invite your mentor after claiming.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                  <GitBranch className="size-3.5 text-text-muted" /> Branch or PR Name
                </label>
                <Input
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="main or feature/auth-fix"
                  className="h-10 bg-background text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-primary">
                  Primary Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-amber/20"
                >
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary">
                Specific Files or Directories to Review (Optional)
              </label>
              <Input
                value={specificFiles}
                onChange={(e) => setSpecificFiles(e.target.value)}
                placeholder="e.g. src/auth/session.ts, src/controllers/orderController.ts"
                className="h-10 bg-background text-sm"
              />
              <p className="text-[11px] text-text-muted">
                Guide the mentor directly to the relevant files in your repository.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Escrow & Wallet Summary Card */}
      <div className="p-6 rounded-2xl bg-surface-raised/80 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <Coins className="size-4 text-amber" /> DevWallet Escrow Authorization
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Credits remain safely in escrow until you approve and release the mentor’s completed review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-surface border border-border text-right">
              <span className="text-[10px] text-text-muted uppercase font-bold block">
                Your Balance
              </span>
              <span className="font-serif text-sm font-bold text-text-primary">
                {isWalletLoading ? "..." : `${balance} Credits`}
              </span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-amber-light border border-amber/20 text-right">
              <span className="text-[10px] text-amber uppercase font-bold block">
                Required
              </span>
              <span className="font-serif text-sm font-bold text-amber">
                {requiredCredits} Credits
              </span>
            </div>
          </div>
        </div>

        {!hasSufficientCredits && !isWalletLoading && (
          <div className="p-3.5 rounded-xl bg-rose-light text-rose border border-rose/20 text-xs flex items-start gap-2.5">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Insufficient Balance:</span> You need {requiredCredits - balance} more credits to submit this {tier.toLowerCase()} review request.
              <Link
                href="/dashboard/wallet"
                className="ml-2 font-bold underline hover:text-rose-hover cursor-pointer"
              >
                Top up wallet credits &rarr;
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <ShieldCheck className="size-4 text-emerald" />
            <span>100% Refundable if no mentor claims your request.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/dashboard/code-reviews" className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto text-xs font-semibold h-10 px-4 border-border bg-surface hover:bg-surface-raised cursor-pointer"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={isSubmitting || !hasSufficientCredits}
              className="w-full sm:w-auto text-xs font-bold h-10 px-5 gap-2 bg-amber hover:bg-amber-hover text-surface-dark cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                "Submitting Request..."
              ) : (
                <>
                  <Code2 className="size-4" />
                  Submit Review ({requiredCredits} Credits)
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
