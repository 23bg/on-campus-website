import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://oncampus.in";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/i/"],
                disallow: [
                    "/dashboard/",
                    "/api/",
                    "/onboarding/",
                    "/verification",
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
