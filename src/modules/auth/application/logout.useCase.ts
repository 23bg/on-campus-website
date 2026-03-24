import { jwtAuthService } from "@/modules/auth/infrastructure/jwtAuthService";

export const logoutUseCase = async () => {
    const accessToken = await jwtAuthService.readAccessTokenFromCookie();
    const access = accessToken ? jwtAuthService.verifyAccessToken(accessToken) : null;

    await jwtAuthService.clearAuthCookies();

    if (access?.userId) {
        const { authUserRepository } = await import("@/modules/auth/infrastructure/authUserRepository");
        await authUserRepository.incrementTokenVersion(access.userId);
    }

    return { userId: access?.userId ?? null };
};
