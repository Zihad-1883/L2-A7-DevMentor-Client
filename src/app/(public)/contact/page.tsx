"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate non-blocking API submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitted(true);
    toast.success("Thank you! Your inquiry has been dispatched to our support team.");
    reset();
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/80 bg-surface py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-border shadow-xs mb-4">
              <span className="size-2 rounded-full bg-amber animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
                Direct Help &amp; Inquiries
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-text-primary tracking-tight mb-3">
              We&apos;re Here to Help
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Have questions regarding 1-on-1 sprint booking, bKash credit refunds, or mentor verification? Reach out to our engineering support desk.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Info & Form */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">
                Get in Touch Directly
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Our support team is available Saturday through Thursday. We respond to all technical and financial inquiries within 4 business hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-border bg-surface flex items-start gap-4">
                <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center shrink-0 border border-amber/20">
                  <Phone className="size-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Helpline &amp; WhatsApp
                  </h3>
                  <a
                    href="tel:01322810874"
                    className="text-sm font-semibold text-text-primary hover:text-amber transition-colors mt-0.5 block"
                  >
                    +880 1322-810874
                  </a>
                  <a
                    href="tel:01332502004"
                    className="text-xs text-text-secondary hover:text-amber transition-colors block"
                  >
                    +880 1332-502004
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-surface flex items-start gap-4">
                <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center shrink-0 border border-amber/20">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Email Support
                  </h3>
                  <a
                    href="mailto:support@devmentor.com"
                    className="text-sm font-semibold text-text-primary hover:text-amber transition-colors mt-0.5 block"
                  >
                    support@devmentor.com
                  </a>
                  <p className="text-xs text-text-muted">Average reply time: under 4 hours</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-surface flex items-start gap-4">
                <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center shrink-0 border border-amber/20">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Main Office
                  </h3>
                  <p className="text-sm font-semibold text-text-primary mt-0.5">
                    Level 4, House 1162, Road 10, Avenue 12
                  </p>
                  <p className="text-xs text-text-secondary">Mirpur DOHS, Dhaka, Bangladesh</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-surface flex items-start gap-4">
                <div className="size-10 rounded-xl bg-amber-light text-amber flex items-center justify-center shrink-0 border border-amber/20">
                  <Clock className="size-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Operating Hours
                  </h3>
                  <p className="text-sm font-semibold text-text-primary mt-0.5">
                    Saturday – Thursday
                  </p>
                  <p className="text-xs text-text-secondary">10:00 AM to 7:00 PM (GMT+6)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl border border-border bg-surface shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-text-muted mb-6">
                Fill in your details and an engineering advisor will respond promptly.
              </p>

              {isSubmitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-light border border-emerald/30 text-emerald flex items-center gap-2.5 text-xs font-semibold">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Message delivered! We will get back to you shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface-raised/40 text-sm text-text-primary focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-500 font-medium mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface-raised/40 text-sm text-text-primary focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-500 font-medium mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                    Subject *
                  </label>
                  <input
                    {...register("subject")}
                    type="text"
                    placeholder="e.g. Question about Sprint Escrow or Cohort Pricing"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface-raised/40 text-sm text-text-primary focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                  />
                  {errors.subject && (
                    <p className="text-xs text-rose-500 font-medium mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                    Message *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    placeholder="Describe how we can help you..."
                    className="w-full p-4 rounded-xl border border-border bg-surface-raised/40 text-sm text-text-primary focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-500 font-medium mt-1">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-amber text-white hover:bg-amber-hover font-semibold text-xs tracking-wide shadow-md gap-2 cursor-pointer transition-all"
                >
                  <Send className="size-4" />
                  <span>{isSubmitting ? "Sending..." : "Submit Message"}</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
