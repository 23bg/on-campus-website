import { prisma } from "@/lib/db/prisma";
import { feeRepository } from "@/features/fee/feeDataApi"; // Keep for now, but will be removed later

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
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        const [
            candidatesAgg, // Renamed from leadsAgg
            hiresAgg,      // Renamed from admissionsAgg
            employeesAgg,  // Renamed from studentsAgg (placeholder)
            candidatesTodayAgg, // Renamed from leadsTodayAgg
            employeesTodayAgg,  // Renamed from studentsTodayAgg (placeholder)
            totalJobs, // New metric
            pipelineDistribution, // New metric (placeholder for actual aggregation)
            todaysInterviews, // Renamed from todaysFollowUps
            overdueInterviews, // Renamed from overdueFollowUps
        ] = await Promise.all([
            prisma.candidate.aggregateRaw({ // Updated from prisma.lead
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
            prisma.candidate.aggregateRaw({ // Updated from prisma.lead
                pipeline: [
                    {
                        $match: {
                            instituteId,
                            status: "SELECTED", // Updated from "ADMITTED"
                            updatedAt: { $gte: monthStart },
                        },
                    },
                    { $count: "count" },
                ],
            }),
            prisma.student.aggregateRaw({ // TODO: Update to prisma.employee.aggregateRaw
                pipeline: [
                    {
                        $match: {
                            instituteId,
                        },
                    },
                    { $count: "count" },
                ],
            }),
            prisma.candidate.aggregateRaw({ // Updated from prisma.lead
                pipeline: [
                    {
                        $match: {
                            instituteId,
                            createdAt: { $gte: todayStart, $lt: tomorrowStart },
                        },
                    },
                    { $count: "count" },
                ],
            }),
            prisma.student.aggregateRaw({ // TODO: Update to prisma.employee.aggregateRaw
                pipeline: [
                    {
                        $match: {
                            instituteId,
                            createdAt: { $gte: todayStart, $lt: tomorrowStart },
                        },
                    },
                    { $count: "count" },
                ],
            }),
            prisma.job.count({ // New metric
                where: { instituteId },
            }),
            // TODO: Implement actual pipeline distribution aggregation
            Promise.resolve([]), // Placeholder for pipelineDistribution
            prisma.candidate.findMany({ // Updated from prisma.lead
                where: {
                    instituteId,
                    followUpAt: { gte: todayStart, lt: tomorrowStart }, // TODO: Change to interviewAt
                    status: { notIn: ["SELECTED", "REJECTED"] }, // Updated from "ADMITTED", "DROPPED"
                },
                orderBy: { followUpAt: "asc" }, // TODO: Change to interviewAt
                take: 20,
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    followUpAt: true, // TODO: Change to interviewAt
                    status: true,
                },
            }),
            prisma.candidate.findMany({ // Updated from prisma.lead
                where: {
                    instituteId,
                    followUpAt: { lt: todayStart }, // TODO: Change to interviewAt
                    status: { notIn: ["SELECTED", "REJECTED"] }, // Updated from "ADMITTED", "DROPPED"
                },
                orderBy: { followUpAt: "asc" }, // TODO: Change to interviewAt
                take: 20,
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    followUpAt: true, // TODO: Change to interviewAt
                    status: true,
                },
            }),
        ]);

        const candidatesThisMonth = parseAggregateCount(candidatesAgg);
        const hiresThisMonth = parseAggregateCount(hiresAgg);
        const totalEmployees = parseAggregateCount(employeesAgg);
        const candidatesToday = parseAggregateCount(candidatesTodayAgg);
        const employeesToday = parseAggregateCount(employeesTodayAgg);

        const conversionPercentage = candidatesThisMonth > 0 ? Math.round((hiresThisMonth / candidatesThisMonth) * 100) : 0;

        return {
            candidatesThisMonth,
            hiresThisMonth,
            totalEmployees,
            conversionPercentage,
            totalJobs, // New metric
            candidatesPerJob: 0, // TODO: Implement candidates per job calculation
            pipelineDistribution: pipelineDistribution, // New metric
            todayOverview: {
                newCandidates: candidatesToday,
                newEmployees: employeesToday,
            },
            interviewOverview: { // Renamed from followUpOverview
                todayCount: todaysInterviews.length,
                overdueCount: overdueInterviews.length,
                todaysInterviews,
                overdueInterviews,
            },
        };
    },
};

