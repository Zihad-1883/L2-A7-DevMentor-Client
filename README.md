# DevMentor — Production-Grade Engineering Mentorship & Code Review Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-15%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better--Auth-Security-000000?style=for-the-badge)](https://www.better-auth.com/)

DevMentor is an engineering mentorship, batch cohort, and async code review ecosystem built for developers. It bridges the gap between learning programming syntax and engineering production software through 1-on-1 sprint coaching, admin-approved group cohorts, SLA-guaranteed code reviews, and multi-provider AI discovery engines.

---

## 🌐 Live Deployments & Repository Links

- **Live Application**: [https://dev-mentor-client.vercel.app](https://dev-mentor-client.vercel.app)
- **Production Backend API**: [https://dev-mentor-server.vercel.app](https://dev-mentor-server.vercel.app)
- **Frontend Repository**: [https://github.com/Zihad-1883/L2-A7-DevMentor-Client](https://github.com/Zihad-1883/L2-A7-DevMentor-Client)
- **Backend Repository**: [https://github.com/Zihad-1883/L2-A6-DevMentor-Server](https://github.com/Zihad-1883/L2-A6-DevMentor-Server)

---

## 🔑 Demo Access Credentials

1-click instant login buttons are available on the `/login` page for all three roles:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `student@devmentor.com` | `Student@123456` | Book Sprints, Enroll Cohorts, Request Reviews, Take Exams |
| **Demo Mentor** | `mentor@devmentor.com` | `Mentor@123456` | Claim Sprints, Host Cohorts, Deliver Code Reviews, Cash Out |
| **Demo Admin** | `admin@devmentor.com` | `Admin@123456` | Verify Mentors, Approve Cohorts, Moderate Users, Disburse Payouts |

---

## 🚀 Core Features

### 1. 🤖 Intelligent AI Capabilities (3 Multi-Provider Engines)
- **AI Assistant & FAQ Chatbot (`DevMentorAiBot`)**: Floating, globally-mounted assistant grounded on verified platform knowledge (DevCredits exchange rate, review SLAs, sprint workflows) with suggested prompt chips and markdown rendering.
- **Smart AI Mentor & Cohort Matcher (`SmartAiMatcher`)**: Embedded in `/mentors`, `/cohorts`, and Home. Matches natural language goals (e.g. *"Next.js 15 auth with Docker"*) against live database records with compatibility score badges (e.g. `95% Match`) and personalized reasoning.
- **Automated Code Review Pre-Scan (`CodePreScanWidget`)**: Embedded in `/dashboard/code-reviews/new`. Analyzes code complexity, detects static syntax & safety issues (`critical`, `warning`, `suggestion`), calculates a Maintainability Score (1–100), and auto-appends suggested mentor focus notes to review requests.
- **Failover Architecture**: Primary Google Gemini + fast Groq failover + offline deterministic rule fallback for 100% uptime without server crashes.

### 2. ⚡ DevCredits Virtual Economy & Escrow
- **Virtual Currency**: `1 DevCredit = ৳4.00 BDT`.
- **bKash Payment Gateway**: Real-time student wallet top-ups with preset packages (50 Cr to 1000 Cr).
- **Escrow Protection**: Credits remain locked in platform escrow and are disbursed to mentors only upon completed sessions or finalized code review deliverables.
- **Mentor Cash-Out**: Verified mentors withdraw settled earnings directly to personal bKash accounts.

### 3. 🎯 1-on-1 Mentorship Sprints
- Direct booking with verified mentors or broadcast requests to the open pool.
- Customizable duration and specific session days (`selectedDays.length * 50 Credits`).
- Daily checklist milestones, live meeting coordination, and progress tracking.

### 4. 📚 Curated Batch Cohorts
- Multi-session technical bootcamps led by senior engineering leaders.
- Modular session-based pricing allowing students to pay per session with credits.
- Embedded resources (code snippets, repository links, lecture notes) and seat limit enforcement.

### 5. 🔍 Code Review Escrow Marketplace
- **Quick Review**: 10 DevCredits (৳40 BDT) with strict 2-Hour SLA turnaround.
- **Deep Review**: 50 DevCredits (৳200 BDT) with 24-Hour SLA for architecture and security audits.
- Mentors provide inline code annotations, verdict scores, and refactored code diffs.

### 6. 🏆 Timed Skill Assessments & MCQ Benchmarking
- Timed 20–30 minute objective examinations covering Frontend, Backend, Databases, and DevOps.
- Instant automated grading with verifiable skill badges displayed on public mentor/student profiles.

### 7. 🛡️ Role-Based Architecture & Dashboards
- **Student Dashboard (`/dashboard`)**: Active sprints, enrolled cohorts, exam attempts, review requests, and wallet ledger.
- **Mentor Studio (`/mentor`)**: Open sprint pool, cohort management, code review claims, and bKash payout requests.
- **Admin Command Center (`/admin`)**: Interactive revenue & user distribution charts, mentor applicant queue, cohort approvals, and financial disbursement logs.

---

## 🛠️ Technology Stack

### **Frontend Architecture**
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) with Vanilla CSS custom design tokens
- **Icons & Visuals**: [Lucide React](https://lucide.dev/)
- **State & Server Cache**: [TanStack Query v5](https://tanstack.com/query/latest) & [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Authentication**: [Better-Auth React Client](https://www.better-auth.com/) (Email/Password, Email OTP, Google OAuth)
- **Charts & Data Visuals**: [Recharts](https://recharts.org/)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Dark / Light Theme**: [Next-Themes](https://github.com/pacocoursey/next-themes)

---

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "16.3.8",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "typescript": "^5",
    "@tanstack/react-query": "^5.104.1",
    "better-auth": "^1.7.7",
    "react-hook-form": "^7.89.0",
    "zod": "^4.6.5",
    "zustand": "^5.0.15",
    "recharts": "^3.10.1",
    "lucide-react": "^1.52.0",
    "next-themes": "^0.4.6",
    "sonner": "^2.0.8",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.7.0"
  }
}
```

---

## ⚙️ Running Locally

Follow these steps to set up and run the frontend client on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/Zihad-1883/L2-A7-DevMentor-Client.git
cd L2-A7-DevMentor-Client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better-Auth Backend Service URL
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000

# Client App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: For production, point `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` to `https://dev-mentor-server.vercel.app`.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore DevMentor.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🎨 Design System & Color Palette
- **Amber Primary**: `#d97706` (Accent badges, glowing CTAs, brand highlights)
- **Terracotta Secondary**: `#ea580c` (Urgent alerts, admin badges, SLA milestones)
- **Emerald Accent**: `#10b981` (Verified indicators, approved courses, escrow guarantees)
- **Neutral Dark / Light**: Strict WCAG-compliant contrast ratios across light and dark modes with glassmorphic cards and unified `rounded-2xl` borders.

---

## 📄 License
This project is licensed under the ISC License. Built for the Level-2 Web Engineering Program.
