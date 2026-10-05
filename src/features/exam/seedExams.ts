import type { Exam, Question } from "@/types/exam.types";

export const SAMPLE_QUESTIONS_BY_EXAM: Record<string, Question[]> = {
  "exam-seed-1": [
    {
      id: "q-1-1",
      examId: "exam-seed-1",
      questionText:
        "Which TypeScript utility type constructs a type with all properties of Type set to optional?",
      options: ["Required<T>", "Partial<T>", "Readonly<T>", "Record<K, T>"],
      correctOptionIndex: 1,
      marks: 1,
      explanation:
        "Partial<T> returns a type with all properties of T set to optional by applying the ? modifier to each key.",
    },
    {
      id: "q-1-2",
      examId: "exam-seed-1",
      questionText:
        "What does the `infer` keyword inside a conditional type `T extends (infer U)[] ? U : never` accomplish?",
      options: [
        "Casts T to an array type at runtime",
        "Introduces a type variable U to be deduced dynamically from the matched array element type",
        "Instructs the compiler to disable strict null checks for U",
        "Creates a union of all object properties inside T",
      ],
      correctOptionIndex: 1,
      marks: 1,
      explanation:
        "In conditional types, `infer` allows introducing a type variable that is deduced from the type being examined.",
    },
    {
      id: "q-1-3",
      examId: "exam-seed-1",
      questionText:
        "What is the key distinction between `unknown` and `any` in TypeScript?",
      options: [
        "`unknown` allows calling methods without type narrowing, whereas `any` causes compilation errors",
        "`unknown` is type-safe: you cannot perform arbitrary operations on it without first asserting or narrowing its type",
        "`any` is only supported in legacy TypeScript versions below 3.0",
        "`unknown` can only hold primitive values such as strings and numbers",
      ],
      correctOptionIndex: 1,
      marks: 1,
      explanation:
        "`unknown` is the type-safe counterpart of `any`. Anything is assignable to `unknown`, but `unknown` isn't assignable to anything else without narrowing or casting.",
    },
    {
      id: "q-1-4",
      examId: "exam-seed-1",
      questionText:
        "How do template literal types `type Event = `${'on'}${Capitalize<'click' | 'hover'>}`` resolve?",
      options: [
        "Resolves to string",
        "Resolves to the union 'onClick' | 'onHover'",
        "Causes a syntax error unless executed inside a Node runtime",
        "Resolves to ['onClick', 'onHover'] array tuple",
      ],
      correctOptionIndex: 1,
      marks: 1,
      explanation:
        "Template literal types distribute over unions, producing every combination: 'onClick' | 'onHover'.",
    },
    {
      id: "q-1-5",
      examId: "exam-seed-1",
      questionText:
        "What is the effect of using `const assertions` (`as const`) on an array literal `[1, 2, 3] as const`?",
      options: [
        "Makes the array a readonly tuple `readonly [1, 2, 3]` with literal number types rather than `number[]`",
        "Prevents garbage collection of the array in V8",
        "Converts the array elements to string values at compile time",
        "Marks the array as deeply immutable across all prototype modifications",
      ],
      correctOptionIndex: 0,
      marks: 1,
      explanation:
        "`as const` prevents literal types from being widened (e.g. 1 is not widened to number) and marks objects/arrays as readonly.",
    },
  ],
  "exam-seed-2": [
    {
      id: "q-2-1",
      examId: "exam-seed-2",
      questionText:
        "By default, what type of component is created in the Next.js App Router inside `app/`?",
      options: [
        "Client Component ('use client')",
        "React Server Component (RSC)",
        "Edge Worker Function",
        "Static HTML generator component",
      ],
      correctOptionIndex: 1,
      marks: 1,
      explanation:
        "All components inside the App Router are React Server Components by default unless explicitly marked with 'use client'.",
    },
    {
      id: "q-2-2",
      examId: "exam-seed-2",
      questionText:
        "Which function should be used in Next.js Server Actions or Route Handlers to purge cached data for a specific path?",
      options: [
        "clearCache()",
        "revalidatePath('/path')",
        "invalidateTags()",
        "Router.refresh()",
      ],
      correctOptionIndex: 1,
      marks: 1,
      explanation:
        "`revalidatePath()` invalidates the cached data on-demand for a given URL path.",
    },
    {
      id: "q-2-3",
      examId: "exam-seed-2",
      questionText:
        "Why can you NOT pass event handlers (like `onClick`) from a Server Component to a Client Component as props?",
      options: [
        "Functions cannot be serialized across the React Server Component wire protocol",
        "Server Components do not have access to the JavaScript call stack",
        "Next.js automatically strips all function props during compilation",
        "Browser security policies forbid running server functions in DOM events",
      ],
      correctOptionIndex: 0,
      marks: 1,
      explanation:
        "Props passed across the Server/Client boundary must be serializable by React (JSON-like objects, strings, numbers, promises), which excludes functions.",
    },
  ],
  "exam-seed-3": [
    {
      id: "q-3-1",
      examId: "exam-seed-3",
      questionText:
        "Which PostgreSQL command provides the estimated execution plan without actually running the query?",
      options: ["EXPLAIN", "EXPLAIN ANALYZE", "SHOW QUERY", "PRAGMA plan"],
      correctOptionIndex: 0,
      marks: 1,
      explanation:
        "`EXPLAIN` prints the planner's cost estimate. Adding `ANALYZE` executes the query to return real run times.",
    },
    {
      id: "q-3-2",
      examId: "exam-seed-3",
      questionText:
        "What type of index in PostgreSQL is most appropriate for searching inside JSONB columns or full-text documents?",
      options: ["B-Tree", "GIN (Generalized Inverted Index)", "BRIN", "Hash"],
      correctOptionIndex: 1,
      marks: 1,
      explanation:
        "GIN is specifically tailored for composite items (arrays, JSONB documents, tsvector full-text search) where elements appear multiple times.",
    },
  ],
};

export const SEED_EXAMS: Exam[] = [
  {
    id: "exam-seed-1",
    mentorId: "mentor-seed-1",
    title: "TypeScript Generics & Advanced Type System",
    description:
      "Test your understanding of conditional types, mapped types, keyof operator, template literal types, and complex inference rules.",
    durationMinutes: 25,
    totalQuestions: 5,
    totalMarks: 5,
    passMark: 70,
    isFree: true,
    status: "PUBLISHED",
    category: "TypeScript",
    difficulty: "INTERMEDIATE",
    techStackTags: ["TypeScript", "Frontend", "Backend"],
    mentor: {
      id: "mentor-seed-1",
      name: "Alex Vance",
    },
    questions: SAMPLE_QUESTIONS_BY_EXAM["exam-seed-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "exam-seed-2",
    mentorId: "mentor-seed-2",
    title: "Next.js 15 App Router & Server Components",
    description:
      "Deep dive into React Server Components (RSC), Suspense boundaries, streaming SSR, parallel routes, and cache invalidation strategies.",
    durationMinutes: 20,
    totalQuestions: 3,
    totalMarks: 3,
    passMark: 65,
    isFree: true,
    status: "PUBLISHED",
    category: "Next.js",
    difficulty: "ADVANCED",
    techStackTags: ["Next.js", "React", "TypeScript"],
    mentor: {
      id: "mentor-seed-2",
      name: "Elena Rostova",
    },
    questions: SAMPLE_QUESTIONS_BY_EXAM["exam-seed-2"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "exam-seed-3",
    mentorId: "mentor-seed-3",
    title: "PostgreSQL Query Optimization & Indexing",
    description:
      "Evaluate your knowledge on EXPLAIN ANALYZE, B-Tree vs GIN indexes, vacuum tuning, connection pooling, and multi-tenant sharding architectures.",
    durationMinutes: 15,
    totalQuestions: 2,
    totalMarks: 2,
    passMark: 65,
    isFree: true,
    status: "PUBLISHED",
    category: "PostgreSQL",
    difficulty: "ADVANCED",
    techStackTags: ["PostgreSQL", "Database", "Backend"],
    mentor: {
      id: "mentor-seed-3",
      name: "Tariq Rahman",
    },
    questions: SAMPLE_QUESTIONS_BY_EXAM["exam-seed-3"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "exam-seed-4",
    mentorId: "mentor-seed-4",
    title: "Distributed Systems & RESTful API Architecture",
    description:
      "Fundamental principles of idempotency, caching tiers, rate limiting algorithms (Token Bucket, Leaky Bucket), and eventual consistency.",
    durationMinutes: 30,
    totalQuestions: 5,
    totalMarks: 5,
    passMark: 70,
    isFree: true,
    status: "PUBLISHED",
    category: "System Design",
    difficulty: "INTERMEDIATE",
    techStackTags: ["System Design", "Node.js", "Docker"],
    mentor: {
      id: "mentor-seed-4",
      name: "Sofia Lin",
    },
    questions: SAMPLE_QUESTIONS_BY_EXAM["exam-seed-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "exam-seed-5",
    mentorId: "mentor-seed-5",
    title: "Docker & Container Orchestration Fundamentals",
    description:
      "Assessment on multi-stage builds, rootless container security, layer caching optimization, network bridges, and persistent volumes.",
    durationMinutes: 20,
    totalQuestions: 5,
    totalMarks: 5,
    passMark: 60,
    isFree: true,
    status: "PUBLISHED",
    category: "DevOps",
    difficulty: "BEGINNER",
    techStackTags: ["Docker", "DevOps", "Linux"],
    mentor: {
      id: "mentor-seed-5",
      name: "David Kim",
    },
    questions: SAMPLE_QUESTIONS_BY_EXAM["exam-seed-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "exam-seed-6",
    mentorId: "PSIGwHz2FJCc6qEW9m14KACWyQ9yHj9m",
    title: "Advanced Backend Engineering Cohort Benchmark",
    description:
      "Mid-term examination for enrolled students in the Advanced Backend Engineering Cohort covering Prisma ORM transactions, JWT rotation, and RBAC.",
    durationMinutes: 45,
    totalQuestions: 5,
    totalMarks: 5,
    passMark: 80,
    isFree: false,
    status: "PUBLISHED",
    cohortId: "cmunzgxqw000004jn43xowsbk",
    cohort: {
      id: "cmunzgxqw000004jn43xowsbk",
      title: "Advanced Backend Engineering & System Architecture",
    },
    category: "Node.js",
    difficulty: "ADVANCED",
    techStackTags: ["Node.js", "TypeScript", "Prisma", "PostgreSQL"],
    mentor: {
      id: "PSIGwHz2FJCc6qEW9m14KACWyQ9yHj9m",
      name: "Mentor",
    },
    questions: SAMPLE_QUESTIONS_BY_EXAM["exam-seed-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
