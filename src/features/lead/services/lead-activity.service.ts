import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/utils/logger";

export type LeadActivityType =
    | "LEAD_CREATED"
    | "STATUS_CHANGED"
    | "NOTE_ADDED"
    | "FOLLOWUP_SCHEDULED"
    | "FOLLOWUP_COMPLETED"
    | "ASSIGNED_USER_CHANGED"
    | "CONVERTED_TO_STUDENT";

export type LeadActivityEntry = {
    leadId: string;
    instituteId: string;
    activityType: LeadActivityType;
    title: string;
    description?: string;
    actorUserId?: string;
    createdAt: Date;
};

export const leadActivityService = {
    async log(entry: Omit<LeadActivityEntry, "createdAt"> & { createdAt?: Date }) {
        const createdAt = entry.createdAt ?? new Date();
        const updated = await prisma.lead.updateMany({
            where: { id: entry.leadId, instituteId: entry.instituteId },
            data: {
                activities: {
                    push: {
                        activityType: entry.activityType,
                        title: entry.title,
                        description: entry.description,
                        actorUserId: entry.actorUserId,
                        createdAt,
                    },
                },
            },
        });

        if (updated.count === 0) {
            logger.warn("lead activity logging skipped: lead not found for embedded activity push");
        }
    },

    async listByLead(instituteId: string, leadId: string) {
        const lead = await prisma.lead.findFirst({
            where: { id: leadId, instituteId },
            select: {
                id: true,
                instituteId: true,
                activities: true,
            },
        });

        if (!lead) return [];

        return (lead.activities ?? [])
            .slice()
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 100)
            .map((row) => ({
                leadId: lead.id,
                instituteId: lead.instituteId,
                activityType: row.activityType as LeadActivityType,
                title: row.title,
                description: row.description,
                actorUserId: row.actorUserId,
                createdAt: row.createdAt.toISOString(),
            }));
    },
};
