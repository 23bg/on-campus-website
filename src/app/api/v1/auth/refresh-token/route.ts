import { NextRequest } from "next/server";
import { createRouteLogger } from "@/lib/api/route-logger";
import { refreshTokenController } from "@/modules/auth/api/refreshToken.controller";

export async function POST(req: NextRequest) {
    const routeLog = createRouteLogger("/api/v1/auth/refresh-token#POST", req);
    const response = await refreshTokenController();
    routeLog.info("refresh_token_completed", { status: response.status });
    return response;
}
