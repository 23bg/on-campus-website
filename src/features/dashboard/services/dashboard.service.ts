import { prisma } from "@/lib/db/prisma";
import { feeRepository } from "@/features/fee/repositories/fee.repo";

const parseAggregateCount = (value: unknown) => {
    if (!Array.isArray(value)) return 0;
    const first = value[0];
    if (!first || typeof first !== "object") return 0;
    const count = (first as { count?: unknown }).count;
    return typeof count === "number" ? count : Number(count ?? 0);
};

export const dashboardService = {
    async getMetrics(instituteId: string) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const [leadsAgg, admissionsAgg, studentsAgg, feesCollected, outstandingFees] = await Promise.all([
            prisma.lead.aggregateRaw({
                pipeline: [
                    {
                        $match: {
                            instituteId,
                            createdAt: { $gte: monthStart },
                        },
                    },
                    { $count: "count" },
                ],
            }),
            prisma.lead.aggregateRaw({
                pipeline: [
                    {
                        $match: {
                            instituteId,
                            status: "ADMITTED",
                            updatedAt: { $gte: monthStart },
                        },
                    },
                    { $count: "count" },
                ],
            }),
            prisma.student.aggregateRaw({
                pipeline: [
                    {
                        $match: {
                            instituteId,
                        },
                    },
                    { $count: "count" },
                ],
            }),
            feeRepository.totalCollectedByInstitute(instituteId, monthStart),
            feeRepository.totalOutstandingByInstitute(instituteId),
        ]);

        const leadsThisMonth = parseAggregateCount(leadsAgg);
        const admissionsThisMonth = parseAggregateCount(admissionsAgg);
        const totalStudents = parseAggregateCount(studentsAgg);

        const conversionPercentage = leadsThisMonth > 0 ? Math.round((admissionsThisMonth / leadsThisMonth) * 100) : 0;

        return {
            leadsThisMonth,
            admissionsThisMonth,
            totalStudents,
            conversionPercentage,
            totalFeesCollectedThisMonth: feesCollected,
            totalOutstandingFees: outstandingFees,
        };
    },
};
