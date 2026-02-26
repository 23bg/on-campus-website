import { z } from "zod";
import { userRepository } from "@/features/auth/repositories/user.repo";
import { AppError } from "@/lib/utils/error";

const roleSchema = z.enum(["MANAGER", "VIEWER"]);

export const teamService = {
    async listMembers(instituteId: string) {
        return userRepository.listByInstitute(instituteId);
    },

    async createMember(
        instituteId: string,
        actorRole: "OWNER" | "MANAGER" | "VIEWER",
        payload: { email: string; name?: string; role: "MANAGER" | "VIEWER" }
    ) {
        if (actorRole !== "OWNER") {
            throw new AppError("Only owners can add team members", 403, "FORBIDDEN");
        }

        const email = payload.email.trim().toLowerCase();
        const role = roleSchema.parse(payload.role);
        const existing = await userRepository.findByEmail(email);

        if (existing?.instituteId && existing.instituteId !== instituteId) {
            throw new AppError("User already belongs to another institute", 409, "USER_ALREADY_ASSIGNED");
        }

        if (existing) {
            return userRepository.updateByEmail(email, {
                instituteId,
                role,
                name: payload.name ?? existing.name,
            });
        }

        return userRepository.create({
            email,
            instituteId,
            role,
            name: payload.name,
            emailVerified: false,
        });
    },

    async updateMemberRole(
        instituteId: string,
        actorRole: "OWNER" | "MANAGER" | "VIEWER",
        actorUserId: string,
        memberId: string,
        role: "MANAGER" | "VIEWER"
    ) {
        if (actorRole !== "OWNER") {
            throw new AppError("Only owners can update team roles", 403, "FORBIDDEN");
        }

        if (memberId === actorUserId) {
            throw new AppError("Owner role cannot be changed", 400, "INVALID_OPERATION");
        }

        const nextRole = roleSchema.parse(role);
        const result = await userRepository.updateByIdAndInstitute(memberId, instituteId, { role: nextRole });

        if (result.count === 0) {
            throw new AppError("Team member not found", 404, "TEAM_MEMBER_NOT_FOUND");
        }

        return { updated: true };
    },

    async removeMember(
        instituteId: string,
        actorRole: "OWNER" | "MANAGER" | "VIEWER",
        actorUserId: string,
        memberId: string
    ) {
        if (actorRole !== "OWNER") {
            throw new AppError("Only owners can remove team members", 403, "FORBIDDEN");
        }

        if (memberId === actorUserId) {
            throw new AppError("Owner cannot remove self", 400, "INVALID_OPERATION");
        }

        const result = await userRepository.removeByIdAndInstitute(memberId, instituteId);
        if (result.count === 0) {
            throw new AppError("Team member not found", 404, "TEAM_MEMBER_NOT_FOUND");
        }

        return { deleted: true };
    },
};
