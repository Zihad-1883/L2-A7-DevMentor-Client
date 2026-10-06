// 1-on-1 sprint request & session TypeScript interfaces

export type SprintStatus = "PENDING_CLAIM" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type SprintSessionStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface SprintSessionItem {
    id: string;
    sprintId?: string;
    dayNumber: number;
    scheduledAt: string;
    meetingLink?: string | null;
    status: SprintSessionStatus;
    notes?: string | null;
}

export interface SprintRequestItem {
    id: string;
    studentId: string;
    mentorId?: string | null;
    title: string;
    description: string;
    techStackTags: string[];
    startDate: string;
    durationDays: number;
    selectedDays: number[];
    status: SprintStatus;
    createdAt: string;
    updatedAt?: string;
    student: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
    };
    mentor?: {
        id: string;
        name: string;
        email?: string;
        image?: string | null;
    } | null;
    sessions?: SprintSessionItem[];
}

export interface CreateSprintInput {
    title: string;
    description: string;
    techStackTags: string[];
    startDate: string;
    durationDays: number;
    selectedDays: number[];
}

export interface UpdateSprintInput {
    title?: string;
    description?: string;
    techStackTags?: string[];
    startDate?: string;
    durationDays?: number;
    selectedDays?: number[];
}
