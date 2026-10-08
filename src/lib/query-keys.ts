export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
    user: ["auth", "user"] as const,
  },

  users: {
    me: ["users", "me"] as const,
    dashboard: (role?: string) => ["users", "dashboard", role] as const,
  },

  mentors: {
    all: ["mentors"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["mentors", "list", filters ?? {}] as const,
    detail: (id: string) => ["mentors", "detail", id] as const,
    myProfile: ["mentors", "my-profile"] as const,
  },

  sprints: {
    all: ["sprints"] as const,
    mySprints: (filters?: Record<string, unknown>) =>
      ["sprints", "my-sprints", filters ?? {}] as const,
    openPool: (filters?: Record<string, unknown>) =>
      ["sprints", "open-pool", filters ?? {}] as const,
    detail: (id: string) => ["sprints", "detail", id] as const,
    sessions: (sprintId: string) =>
      ["sprints", sprintId, "sessions"] as const,
  },

  cohorts: {
    all: ["cohorts"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["cohorts", "list", filters ?? {}] as const,
    myCreated: (filters?: Record<string, unknown>) =>
      ["cohorts", "my-created", filters ?? {}] as const,
    detail: (id: string) => ["cohorts", "detail", id] as const,
    sessions: (cohortId: string) =>
      ["cohorts", cohortId, "sessions"] as const,
    enrollments: (cohortId: string) =>
      ["cohorts", cohortId, "enrollments"] as const,
  },

  enrollments: {
    myCohorts: ["enrollments", "my-cohorts"] as const,
    mySprints: ["enrollments", "my-sprints"] as const,
  },

  codeReviews: {
    all: ["code-reviews"] as const,
    openPool: (filters?: Record<string, unknown>) =>
      ["code-reviews", "open-pool", filters ?? {}] as const,
    myRequests: (filters?: Record<string, unknown>) =>
      ["code-reviews", "my-requests", filters ?? {}] as const,
    myClaimed: (filters?: Record<string, unknown>) =>
      ["code-reviews", "my-claimed", filters ?? {}] as const,
    detail: (id: string) => ["code-reviews", "detail", id] as const,
  },

  exams: {
    all: ["exams"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["exams", "list", filters ?? {}] as const,
    myCreated: (filters?: Record<string, unknown>) =>
      ["exams", "my-created", filters ?? {}] as const,
    detail: (id: string) => ["exams", "detail", id] as const,
    attempts: (examId?: string) =>
      ["exams", "attempts", examId ?? "all"] as const,
    myAttempts: ["exams", "my-attempts"] as const,
  },

  wallet: {
    me: ["wallet", "me"] as const,
    history: (filters?: Record<string, unknown>) =>
      ["wallet", "history", filters ?? {}] as const,
  },

  admin: {
    users: (filters?: Record<string, unknown>) =>
      ["admin", "users", filters ?? {}] as const,
    mentorsQueue: (filters?: Record<string, unknown>) =>
      ["admin", "mentors-queue", filters ?? {}] as const,
    cohortsQueue: (filters?: Record<string, unknown>) =>
      ["admin", "cohorts-queue", filters ?? {}] as const,
    payoutsQueue: (filters?: Record<string, unknown>) =>
      ["admin", "payouts-queue", filters ?? {}] as const,
    stats: ["admin", "stats"] as const,
    auditLogs: (filters?: Record<string, unknown>) =>
      ["admin", "audit-logs", filters ?? {}] as const,
    settings: ["admin", "settings"] as const,
  },
} as const;
