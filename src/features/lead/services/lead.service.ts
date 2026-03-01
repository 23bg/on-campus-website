import { z } from "zod";
import { leadRepository } from "@/features/lead/repositories/lead.repo";
import { studentRepository } from "@/features/student/repositories/student.repo";
import { instituteRepository } from "@/features/institute/repositories/institute.repo";
import { AppError } from "@/lib/utils/error";
import { leadActivityService } from "@/features/lead/services/lead-activity.service";

const leadInputSchema = z.object({
    instituteId: z.string().min(1),
    name: z.string().trim().min(2).max(80),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    email: z.string().trim().max(120).email().optional(),
    source: z.string().trim().max(80).optional(),
    course: z.string().trim().max(120).optional(),
    message: z.string().trim().max(1024).optional(),
    followUpAt: z.string().optional(),
});

const listInputSchema = z.object({
    status: z.string().optional(),
    query: z.string().trim().max(120).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
});

export const leadService = {
    async createLead(payload: unknown) {
        const input = leadInputSchema.parse(payload);
        const duplicate = await leadRepository.findByPhoneInInstitute(input.instituteId, input.phone);
        if (duplicate) {
            throw new AppError("Lead already exists with this mobile number", 409, "DUPLICATE_LEAD", {
                existingLeadId: duplicate.id,
                existingPhone: duplicate.phone,
            });
        }

        const created = await leadRepository.create({
            ...input,
            followUpAt: input.followUpAt ? new Date(input.followUpAt) : undefined,
            status: "NEW",
        });

        await leadActivityService.log({
            leadId: created.id,
            instituteId: created.instituteId,
            activityType: "LEAD_CREATED",
            title: "Lead created",
        });

        if (created.followUpAt) {
            await leadActivityService.log({
                leadId: created.id,
                instituteId: created.instituteId,
                activityType: "FOLLOWUP_SCHEDULED",
                title: "Follow-up scheduled",
                description: `Next follow-up on ${created.followUpAt.toISOString().slice(0, 10)}`,
            });
        }

        return created;
    },

    async createLeadBySlug(
        slug: string,
        payload: {
            name: string;
            phone: string;
            email?: string;
            source?: string;
            course?: string;
            message?: string;
        }
    ) {
        const institute = await instituteRepository.findBySlug(slug);
        if (!institute) {
            throw new AppError("Institute not found", 404, "INSTITUTE_NOT_FOUND");
        }

        return this.createLead({
            instituteId: institute.id,
            ...payload,
        });
    },

    async updateStatus(instituteId: string, leadId: string, status: string) {
        const beforeUpdate = await leadRepository.findByIdInInstitute(instituteId, leadId);
        if (!beforeUpdate) {
            throw new AppError("Lead not found", 404, "LEAD_NOT_FOUND");
        }

        await leadRepository.updateStatus({ instituteId, leadId, status });
        const updated = await leadRepository.findByIdInInstitute(instituteId, leadId);

        if (!updated) {
            throw new AppError("Lead not found", 404, "LEAD_NOT_FOUND");
        }

        if (beforeUpdate.status !== status) {
            await leadActivityService.log({
                leadId: updated.id,
                instituteId,
                activityType: "STATUS_CHANGED",
                title: "Status changed",
                description: `${beforeUpdate.status} → ${status}`,
            });
        }

        if (status === "ADMITTED") {
            const duplicate = await studentRepository.findByPhoneInInstitute(instituteId, updated.phone);
            if (duplicate) {
                throw new AppError("Student already exists with this phone", 409, "DUPLICATE_STUDENT");
            }

            await studentRepository.create({
                instituteId,
                name: updated.name,
                phone: updated.phone,
                email: updated.email ?? undefined,
            });

            await leadActivityService.log({
                leadId: updated.id,
                instituteId,
                activityType: "CONVERTED_TO_STUDENT",
                title: "Converted to student",
            });
        }

        return updated;
    },

    async updateLeadStatus(instituteId: string, leadId: string, status: string) {
        return this.updateStatus(instituteId, leadId, status);
    },

    async updateLead(
        instituteId: string,
        leadId: string,
        payload: { status?: string; message?: string | null; followUpAt?: string | null }
    ) {
        if (!payload.status && payload.message === undefined && payload.followUpAt === undefined) {
            throw new AppError("Nothing to update", 400, "INVALID_UPDATE");
        }

        if (payload.status) {
            return this.updateStatus(instituteId, leadId, payload.status);
        }

        const existing = await leadRepository.findByIdInInstitute(instituteId, leadId);
        if (!existing) {
            throw new AppError("Lead not found", 404, "LEAD_NOT_FOUND");
        }

        if (payload.message !== undefined && payload.message !== null) {
            z.string().trim().max(1024).parse(payload.message);
        }

        const followUpAt =
            payload.followUpAt === undefined
                ? undefined
                : payload.followUpAt
                    ? new Date(payload.followUpAt)
                    : null;

        await leadRepository.updateByIdInInstitute(instituteId, leadId, {
            message: payload.message,
            followUpAt,
        });

        const updated = await leadRepository.findByIdInInstitute(instituteId, leadId);
        if (!updated) {
            throw new AppError("Lead not found", 404, "LEAD_NOT_FOUND");
        }

        if (
            payload.message !== undefined &&
            payload.message !== null &&
            payload.message.trim().length > 0 &&
            payload.message !== (existing.message ?? "")
        ) {
            await leadActivityService.log({
                leadId: updated.id,
                instituteId,
                activityType: "NOTE_ADDED",
                title: "Note added",
            });
        }

        if (existing.followUpAt?.toISOString() !== updated.followUpAt?.toISOString()) {
            if (updated.followUpAt) {
                await leadActivityService.log({
                    leadId: updated.id,
                    instituteId,
                    activityType: "FOLLOWUP_SCHEDULED",
                    title: "Follow-up scheduled",
                    description: `Next follow-up on ${updated.followUpAt.toISOString().slice(0, 10)}`,
                });
            } else if (existing.followUpAt && !updated.followUpAt) {
                await leadActivityService.log({
                    leadId: updated.id,
                    instituteId,
                    activityType: "FOLLOWUP_COMPLETED",
                    title: "Follow-up completed",
                });
            }
        }

        return updated;
    },

    async getLeadTimeline(instituteId: string, leadId: string) {
        const lead = await leadRepository.findByIdInInstitute(instituteId, leadId);
        if (!lead) {
            throw new AppError("Lead not found", 404, "LEAD_NOT_FOUND");
        }

        return leadActivityService.listByLead(instituteId, leadId);
    },

    async searchLeads(
        instituteId: string,
        query?: string,
        status?: string,
        from?: Date,
        to?: Date
    ) {
        return leadRepository.list({
            instituteId,
            query,
            status,
            from,
            to,
        });
    },

    async getLeads(
        instituteId: string,
        filters: { status?: string; query?: string; from?: string; to?: string }
    ) {
        const parsed = listInputSchema.parse(filters);
        return this.searchLeads(instituteId, parsed.query, parsed.status, parsed.from, parsed.to);
    },

    async filterLeads(instituteId: string, status: string) {
        return leadRepository.list({ instituteId, status });
    },

    async exportLeads(instituteId: string) {
        const leads = await leadRepository.list({ instituteId });
        return leads.map((lead) => ({
            id: lead.id,
            name: lead.name,
            phone: lead.phone,
            email: lead.email ?? "",
            status: lead.status,
            source: lead.source ?? "",
            createdAt: lead.createdAt.toISOString(),
        }));
    },
};
