import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { withTenantScope } from "@/lib/db/tenant-scope";
import { studentService } from "@/server/studentsApi";
import { instituteRepository } from "@/features/institute/instituteDataApi";
import { AppError } from "@/lib/utils/error";
import { billingService } from "@/features/billing/billingApi";
import { eventDispatcherService } from "@/lib/notifications/event-dispatcher.service";
import { logger } from "@/lib/utils/logger";

export type CandidateActivityType =
    | "CANDIDATE_CREATED"
    | "STATUS_CHANGED"
    | "NOTE_ADDED"
    | "FOLLOWUP_SCHEDULED"
    | "FOLLOWUP_COMPLETED"
    | "ASSIGNED_USER_CHANGED"
    | "CONVERTED_TO_EMPLOYEE";

type CreateCandidateInput = {
    instituteId: string;
    name: string;
    phone: string;
    email?: string;
    source?: string;
    jobId?: string; // Changed from course to jobId
    message?: string;
    followUpAt?: Date;
    status?: string;
};

type ListCandidateInput = {
    instituteId: string;
    status?: string;
    query?: string;
    from?: Date;
    to?: Date;
};

type CandidateActivityEntry = {
    candidateId: string; // Changed from leadId to candidateId
    instituteId: string;
    activityType: CandidateActivityType;
    title: string;
    description?: string;
    actorUserId?: string;
    createdAt: Date;
};

const createCandidateRecord = async (payload: CreateCandidateInput) =>
    prisma.candidate.create({
        data: {
            instituteId: payload.instituteId,
            name: payload.name,
            phone: payload.phone,
            email: payload.email,
            source: payload.source,
            jobId: payload.jobId,
            message: payload.message,
            followUpAt: payload.followUpAt,
            status: payload.status ?? "APPLIED",
        },
    });

const bulkCreateCandidateRecords = async (rows: CreateCandidateInput[]) =>
    prisma.candidate.createMany({
        data: rows.map((payload) => ({
            instituteId: payload.instituteId,
            name: payload.name,
            phone: payload.phone,
            email: payload.email,
            source: payload.source,
            jobId: payload.jobId,
            message: payload.message,
            followUpAt: payload.followUpAt,
            status: payload.status ?? "APPLIED",
        })),
    });

const findCandidateByPhoneInInstitute = async (instituteId: string, phone: string) =>
    prisma.candidate.findFirst({
        where: withTenantScope(instituteId, { phone }),
    });

const findCandidateByIdInInstitute = async (instituteId: string, candidateId: string) =>
    prisma.candidate.findFirst({
        where: withTenantScope(instituteId, { id: candidateId }),
    });

const updateCandidateStatusRecord = async (instituteId: string, candidateId: string, status: string) =>
    prisma.candidate.updateMany({
        where: { id: candidateId, instituteId },
        data: { status },
    });

const updateCandidateByIdInInstitute = async (
    instituteId: string,
    candidateId: string,
    payload: { message?: string | null; followUpAt?: Date | null; status?: string }
) =>
    prisma.candidate.updateMany({
        where: { id: candidateId, instituteId },
        data: {
            ...(payload.message !== undefined ? { message: payload.message } : {}),
            ...(payload.followUpAt !== undefined ? { followUpAt: payload.followUpAt } : {}),
            ...(payload.status !== undefined ? { status: payload.status } : {}),
        },
    });

const listCandidateRecords = async (input: ListCandidateInput) =>
    prisma.candidate.findMany({
        where: {
            ...withTenantScope(input.instituteId),
            ...(input.status ? { status: input.status } : {}),
            ...(input.query
                ? {
                    OR: [
                        { name: { contains: input.query, mode: "insensitive" } },
                        { phone: { contains: input.query, mode: "insensitive" } },
                        { email: { contains: input.query, mode: "insensitive" } },
                        { jobId: { contains: input.query, mode: "insensitive" } }, // Changed from course to jobId
                    ],
                }
                : {}),
            ...(input.from || input.to
                ? {
                    createdAt: {
                        ...(input.from ? { gte: input.from } : {}),
                        ...(input.to ? { lte: input.to } : {}),
                    },
                }
                : {}),
        },
        orderBy: { createdAt: "desc" },
    });

const logCandidateActivity = async (entry: Omit<CandidateActivityEntry, "createdAt"> & { createdAt?: Date }) => {
    const createdAt = entry.createdAt ?? new Date();
    const updated = await prisma.candidate.updateMany({
        where: { id: entry.candidateId, instituteId: entry.instituteId },
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
        logger.warn("candidate activity logging skipped: candidate not found for embedded activity push");
    }
};

const listCandidateActivities = async (instituteId: string, candidateId: string) => {
    const candidate = await prisma.candidate.findFirst({
        where: { id: candidateId, instituteId },
        select: {
            id: true,
            instituteId: true,
            activities: true,
        },
    });

    if (!candidate) return [];

    return (candidate.activities ?? [])
        .slice()
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 100)
        .map((row) => ({
            candidateId: candidate.id,
            instituteId: candidate.instituteId,
            activityType: row.activityType as CandidateActivityType,
            title: row.title,
            description: row.description,
            actorUserId: row.actorUserId,
            createdAt: row.createdAt.toISOString(),
        }));
};

const candidateImportRowSchema = z.object({
    name: z.string().trim().min(2).max(80),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    email: z.string().trim().max(120).email().optional(),
    source: z.string().trim().max(80).optional(),
    jobId: z.string().trim().max(120).optional(), // Changed from course to jobId
    city: z.string().trim().max(80).optional(),
    message: z.string().trim().max(1024).optional(),
});

const candidateInputSchema = z.object({
    instituteId: z.string().min(1),
    name: z.string().trim().min(2).max(80),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    email: z.string().trim().max(120).email().optional(),
    source: z.string().trim().max(80).optional(),
    jobId: z.string().trim().max(120).optional(), // Changed from course to jobId
    message: z.string().trim().max(1024).optional(),
    followUpAt: z.string().optional(),
});

const listInputSchema = z.object({
    status: z.string().optional(),
    query: z.string().trim().max(120).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
});

export const candidateActivityService = {
    log: logCandidateActivity,
    listByLead: listCandidateActivities,
};

export const candidateService = {
    async createCandidate(payload: unknown) {
        const input = candidateInputSchema.parse(payload);
        await billingService.assertCanCreateCandidates(input.instituteId);
        const duplicate = await findCandidateByPhoneInInstitute(input.instituteId, input.phone);
        if (duplicate) {
            throw new AppError("Candidate already exists with this mobile number", 409, "DUPLICATE_CANDIDATE", {
                existingCandidateId: duplicate.id,
                existingPhone: duplicate.phone,
            });
        }

        const created = await createCandidateRecord({
            ...input,
            followUpAt: input.followUpAt ? new Date(input.followUpAt) : undefined,
            status: "APPLIED",
        });

        await logCandidateActivity({
            candidateId: created.id,
            instituteId: created.instituteId,
            activityType: "CANDIDATE_CREATED",
            title: "Candidate created",
        });

        if (created.followUpAt) {
            await logCandidateActivity({
                candidateId: created.id,
                instituteId: created.instituteId,
                activityType: "FOLLOWUP_SCHEDULED",
                title: "Follow-up scheduled",
                description: `Next follow-up on ${created.followUpAt.toISOString().slice(0, 10)}`,
            });
        }

        await eventDispatcherService.dispatch({
            event: "CANDIDATE_CREATED",
            instituteId: created.instituteId,
            message: `New application received: ${created.name} (${created.phone}).`,
            link: `/candidates/${created.id}`,
            metadata: { candidateId: created.id },
            whatsappPhoneNumber: created.phone,
            templateEvent: "new_application_alert",
            templateVariables: {
                candidate_name: created.name,
                job_name: created.jobId ?? "General application",
            },
        });

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

        return this.createCandidate({
            instituteId: institute.id,
            ...payload,
        });
    },

    async updateStatus(instituteId: string, candidateId: string, status: string) { // status will be CandidateStatus enum
        const beforeUpdate = await findCandidateByIdInInstitute(instituteId, candidateId);
        if (!beforeUpdate) {
            throw new AppError("Candidate not found", 404, "CANDIDATE_NOT_FOUND");
        }

        await updateCandidateStatusRecord(instituteId, candidateId, status);
        const updated = await findCandidateByIdInInstitute(instituteId, candidateId);

        if (!updated) {
            throw new AppError("Candidate not found", 404, "CANDIDATE_NOT_FOUND");
        }

        if (beforeUpdate.status !== status) {
            await logCandidateActivity({
                candidateId: updated.id,
                instituteId,
                activityType: "STATUS_CHANGED",
                title: "Status changed",
                description: `${beforeUpdate.status} → ${status}`,
            });

            await eventDispatcherService.dispatch({
                event: "CANDIDATE_STATUS_CHANGED",
                instituteId,
                message: `${updated.name} status changed from ${beforeUpdate.status} to ${status}.`,
                link: `/candidates/${updated.id}`,
                metadata: { candidateId: updated.id, previousStatus: beforeUpdate.status, status },
            });
        }

        if (status === "SELECTED") {
            // TODO: Replace with employeeService.findEmployeeByPhoneInInstitute
            const duplicate = await studentService.findStudentByPhoneInInstitute(instituteId, updated.phone);
            if (duplicate) {
                throw new AppError("Employee already exists with this phone", 409, "DUPLICATE_EMPLOYEE");
            }

            // TODO: Replace with employeeService.createEmployeeRecord
            await studentService.createStudentRecord({
                instituteId,
                name: updated.name,
                phone: updated.phone,
                email: updated.email ?? undefined,
            });

            await logCandidateActivity({
                candidateId: updated.id,
                instituteId,
                activityType: "CONVERTED_TO_EMPLOYEE",
                title: "Converted to employee",
            });

            await eventDispatcherService.dispatch({
                event: "CANDIDATE_CONVERTED_TO_EMPLOYEE",
                instituteId,
                message: `Candidate converted to employee: ${updated.name} (${updated.phone}).`,
                link: `/employees`, // TODO: Update link to actual employee page
                whatsappPhoneNumber: updated.phone,
                metadata: { candidateId: updated.id },
                templateEvent: "hiring_confirmed",
                templateVariables: {
                    employee_name: updated.name,
                    job_name: updated.jobId ?? "Job",
                },
            });
        }

        return updated;
    },

    async updateCandidateStatus(instituteId: string, candidateId: string, status: string) {
        return this.updateStatus(instituteId, candidateId, status);
    },

    async updateCandidate(
        instituteId: string,
        candidateId: string,
        payload: { status?: string; message?: string | null; followUpAt?: string | null }
    ) {
        if (!payload.status && payload.message === undefined && payload.followUpAt === undefined) {
            throw new AppError("Nothing to update", 400, "INVALID_UPDATE");
        }

        if (payload.status) {
            return this.updateStatus(instituteId, candidateId, payload.status);
        }

        const existing = await findCandidateByIdInInstitute(instituteId, candidateId);
        if (!existing) {
            throw new AppError("Candidate not found", 404, "CANDIDATE_NOT_FOUND");
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

        await updateCandidateByIdInInstitute(instituteId, candidateId, {
            message: payload.message,
            followUpAt,
        });

        const updated = await findCandidateByIdInInstitute(instituteId, candidateId);
        if (!updated) {
            throw new AppError("Candidate not found", 404, "CANDIDATE_NOT_FOUND");
        }

        if (
            payload.message !== undefined &&
            payload.message !== null &&
            payload.message.trim().length > 0 &&
            payload.message !== (existing.message ?? "")
        ) {
            await logCandidateActivity({
                candidateId: updated.id,
                instituteId,
                activityType: "NOTE_ADDED",
                title: "Note added",
            });

            await eventDispatcherService.dispatch({
                event: "CANDIDATE_NOTE_ADDED",
                instituteId,
                message: `A new note was added for ${updated.name}.`,
                link: `/candidates/${updated.id}`,
                metadata: { candidateId: updated.id },
            });
        }

        if (existing.followUpAt?.toISOString() !== updated.followUpAt?.toISOString()) {
            if (updated.followUpAt) {
                await logCandidateActivity({
                    candidateId: updated.id,
                    instituteId,
                    activityType: "FOLLOWUP_SCHEDULED",
                    title: "Follow-up scheduled",
                    description: `Next follow-up on ${updated.followUpAt.toISOString().slice(0, 10)}`,
                });

                await eventDispatcherService.dispatch({
                    event: "FOLLOW_UP_SCHEDULED",
                    instituteId,
                    message: `Follow-up scheduled for ${updated.name} on ${updated.followUpAt.toISOString().slice(0, 10)}.`,
                    link: `/candidates/${updated.id}`,
                    metadata: { candidateId: updated.id, followUpAt: updated.followUpAt.toISOString() },
                });
            } else if (existing.followUpAt && !updated.followUpAt) {
                await logCandidateActivity({
                    candidateId: updated.id,
                    instituteId,
                    activityType: "FOLLOWUP_COMPLETED",
                    title: "Follow-up completed",
                });

                await eventDispatcherService.dispatch({
                    event: "FOLLOW_UP_COMPLETED",
                    instituteId,
                    message: `Follow-up completed for ${updated.name}.`,
                    link: `/candidates/${updated.id}`,
                    metadata: { candidateId: updated.id },
                });
            }
        }

        return updated;
    },

    async getCandidateTimeline(instituteId: string, candidateId: string) {
        const candidate = await findCandidateByIdInInstitute(instituteId, candidateId);
        if (!candidate) {
            throw new AppError("Candidate not found", 404, "CANDIDATE_NOT_FOUND");
        }

        return listCandidateActivities(instituteId, candidateId);
    },

    async searchCandidates(
        instituteId: string,
        query?: string,
        status?: string,
        from?: Date,
        to?: Date
    ) {
        return listCandidateRecords({
            instituteId,
            query,
            status,
            from,
            to,
        });
    },

    async getCandidates(
        instituteId: string,
        filters: { status?: string; query?: string; from?: string; to?: string }
    ) {
        const parsed = listInputSchema.parse(filters);
        return this.searchCandidates(instituteId, parsed.query, parsed.status, parsed.from, parsed.to);
    },

    async filterCandidates(instituteId: string, status: string) {
        return listCandidateRecords({ instituteId, status });
    },

    async exportCandidates(instituteId: string) {
        const candidates = await listCandidateRecords({ instituteId });
        return candidates.map((candidate) => ({
            id: candidate.id,
            name: candidate.name,
            phone: candidate.phone,
            email: candidate.email ?? "",
            status: candidate.status,
            source: candidate.source ?? "",
            createdAt: candidate.createdAt.toISOString(),
        }));
    },

    async importCandidates(
        instituteId: string,
        rows: unknown[],
        options?: { createdBy?: string; dryRun?: boolean }
    ) {
        if (!Array.isArray(rows) || rows.length === 0) {
            throw new AppError("Import file does not contain any rows", 400, "EMPTY_IMPORT_FILE");
        }

        const errors: Array<{ row: number; message: string }> = [];
        const skippedDuplicates: Array<{ row: number; phone: string }> = [];
        const validRows: Array<z.infer<typeof candidateImportRowSchema>> = [];
        const seenPhones = new Set<string>();

        for (let index = 0; index < rows.length; index += 1) {
            const rowNumber = index + 1;
            const raw = rows[index] as Record<string, unknown>;

            const normalized = {
                name: typeof raw.name === "string" ? raw.name.trim() : "",
                phone: typeof raw.phone === "string" ? String(raw.phone ?? "").trim() : String(raw.phone ?? "").trim(),
                email: typeof raw.email === "string" && raw.email.trim().length > 0 ? raw.email.trim() : undefined,
                source: typeof raw.source === "string" && raw.source.trim().length > 0 ? raw.source.trim() : undefined,
                jobId: typeof raw.jobId === "string" && raw.jobId.trim().length > 0 ? raw.jobId.trim() : undefined, // Changed from course to jobId
                city: typeof raw.city === "string" && raw.city.trim().length > 0 ? raw.city.trim() : undefined,
                message: typeof raw.message === "string" && raw.message.trim().length > 0 ? raw.message.trim() : undefined,
            };

            const parsed = candidateImportRowSchema.safeParse(normalized);
            if (!parsed.success) {
                errors.push({ row: rowNumber, message: parsed.error.issues[0]?.message ?? "Invalid row" });
                continue;
            }

            if (seenPhones.has(parsed.data.phone)) {
                skippedDuplicates.push({ row: rowNumber, phone: parsed.data.phone });
                continue;
            }

            const existing = await findCandidateByPhoneInInstitute(instituteId, parsed.data.phone);
            if (existing) {
                skippedDuplicates.push({ row: rowNumber, phone: parsed.data.phone });
                continue;
            }

            seenPhones.add(parsed.data.phone);
            validRows.push(parsed.data);
        }

        if (!options?.dryRun && validRows.length > 0) {
            await bulkCreateCandidateRecords(
                validRows.map((row) => ({
                    instituteId,
                    name: row.name,
                    phone: row.phone,
                    email: row.email,
                    source: row.source,
                    jobId: row.jobId, // Changed from course to jobId
                    message: row.message,
                    status: "APPLIED",
                }))
            );
        }

        return {
            totalRows: rows.length,
            validRows: validRows.length,
            failedRows: errors.length,
            duplicateRows: skippedDuplicates.length,
            errors,
            duplicates: skippedDuplicates,
            preview: validRows.slice(0, 100),
            imported: options?.dryRun ? 0 : validRows.length,
        };
    },
};




