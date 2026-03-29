export type CandidateActivity = {
    activityType: string;
    title: string;
    description?: string;
    actorUserId?: string;
    createdAt: Date;
};

export interface Candidate {
    id: string;
    instituteId: string;
    name: string;
    phone: string;
    email?: string;
    source?: string;
    jobId?: string;
    message?: string;
    followUpAt?: Date;
    status: "APPLIED" | "SCREENING" | "INTERVIEW" | "SELECTED" | "REJECTED";
    createdBy?: string;
    deletedAt?: Date;
    activities: CandidateActivity[];
    createdAt: Date;
    updatedAt: Date;
}
