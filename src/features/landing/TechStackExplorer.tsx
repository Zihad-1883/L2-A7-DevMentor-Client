import Link from "next/link";
import {
  Code2,
  Database,
  Cloud,
  Cpu,
  Smartphone,
  Layers,
  ArrowRight,
  Flame,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: typeof Code2;
  techs: string[];
  tagParam: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "frontend",
    name: "Frontend Architecture",
    description: "SSR, Hydration, State Management & Modern UI/UX patterns.",
    icon: Code2,
    techs: ["React 19", "Next.js", "TypeScript", "Tailwind CSS"],
    tagParam: "React",
  },
  {
    id: "backend",
    name: "Backend & Distributed APIs",
    description: "RESTful services, microservices, concurrency & security.",
    icon: Cpu,
    techs: ["Node.js", "Express", "Go", "Python", "NestJS"],
    tagParam: "Node.js",
  },
  {
    id: "database",
    name: "Databases & Data Modeling",
    description: "ACID transactions, indexing, pooling & relational schemas.",
    icon: Database,
    techs: ["PostgreSQL", "Prisma ORM", "Redis", "MongoDB"],
    tagParam: "PostgreSQL",
  },
  {
    id: "system-design",
    name: "System Design & Scalability",
    description: "High-throughput architectures, queues, caching & pub/sub.",
    icon: Layers,
    techs: ["Kafka", "Redis", "Rate Limiting", "Architecture"],
    tagParam: "System Design",
  },
  {
    id: "devops",
    name: "Cloud, CI/CD & Containers",
    description: "Containerization, cloud serverless & production deployments.",
    icon: Cloud,
    techs: ["Docker", "Kubernetes", "AWS", "Vercel", "GitHub Actions"],
    tagParam: "Docker",
  },
  {
    id: "mobile",
    name: "Mobile App Development",
    description: "Cross-platform engineering, offline sync & native bridges.",
    icon: Smartphone,
    techs: ["React Native", "Expo", "Flutter", "TypeScript"],
    tagParam: "React Native",
  },
];

export default function TechStackExplorer() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber mb-2">
            <Flame className="size-3.5 fill-amber text-amber" />
            Curated Domains
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Explore Mentorship Categories
          </h2>
          <p className="text-sm text-text-muted mt-1.5 max-w-xl">
            Choose your specialization to find staff-level engineers, sprint guidance, and curated code review tracks.
          </p>
        </div>

        <Link href="/mentors">
          <span className="text-xs font-semibold text-amber hover:text-amber-hover inline-flex items-center gap-1 transition-colors">
            Browse all categories <ArrowRight className="size-3.5" />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={`/mentors?tag=${encodeURIComponent(cat.tagParam)}`}
              className="group p-6 rounded-2xl border border-border bg-surface hover:border-amber/50 hover:bg-surface-raised transition-all flex flex-col justify-between shadow-xs hover:shadow-md cursor-pointer"
            >
              <div>
                <div className="size-12 rounded-xl bg-amber-light text-amber flex items-center justify-center mb-5 border border-amber/20 group-hover:scale-105 transition-transform">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-text-primary group-hover:text-amber transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-surface-raised border border-border/80 text-[11px] font-medium text-text-muted group-hover:border-amber/30 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-text-primary group-hover:text-amber transition-colors">
                  <span>Explore Mentors</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
