import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://oncampus.in";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/i/"],
                disallow: [
                    "/login",
                    "/signup",
                    "/dashboard",
                    "/student",
                    "/onboarding",
                    "/verification",
                    "/api",
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
