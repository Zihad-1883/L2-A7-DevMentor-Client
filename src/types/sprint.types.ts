export type SprintStatus = "PENDING_CLAIM" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type SprintSessionStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface SprintSessionItem {
    id: string;
    sprintId?: string;
    dayNumber: number;
    scheduledAt: string;
    durationMinutes?: number;
    joinLink?: string | null;
    meetingLink?: string | null;
    creditCost?: number;
    status: SprintSessionStatus;
    notes?: string | null;
}

export interface SprintRequestItem {
    id: string;
    studentId: string;
    mentorId?: string | null;
    claimedByMentorId?: string | null;
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
        mentorProfile?: {
            title?: string | null;
            hourlyRate?: number | null;
        } | null;
    } | null;
    claimedByMentor?: {
        id: string;
        name: string;
        email?: string;
        image?: string | null;
        mentorProfile?: {
            title?: string | null;
            hourlyRate?: number | null;
        } | null;
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
