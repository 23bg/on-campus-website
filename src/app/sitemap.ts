import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { INDIAN_CITIES } from "@/data/indianCities";
import { SEO_KEYWORDS } from "@/data/seoKeywords";
import {
    FEATURE_DEEP_DIVE_SLUGS,
    // INDUSTRY_PAGE_SLUGS,
    // PROBLEM_PAGE_SLUGS,
} from "@/lib/seo/programmatic";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://oncampus.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date("2026-01-01")

    const corePages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/features`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/pricing`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/resources`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/use-cases`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/tools`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/institutes`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.8,
        },


    ];

    const featureSlugs = [...new Set([...FEATURE_DEEP_DIVE_SLUGS, "public-institute-page", "subscription-billing"])];

    const featurePages: MetadataRoute.Sitemap = featureSlugs.map((slug) => ({
        url: `${BASE_URL}/features/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const useCasePages: MetadataRoute.Sitemap = [
        "/use-cases/jee-neet-coaching",
        "/use-cases/tuition-classes",
        "/use-cases/computer-training",
        "/use-cases/skill-centers",
    ].map((path) => ({
        url: `${BASE_URL}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    const toolPages: MetadataRoute.Sitemap = [
        "/tools/qr-code-generator",
        "/tools/link-shortener",
        "/tools/course-comparison",
        "/tools/institute-score",
        "/tools/templates",
    ].map((path) => ({
        url: `${BASE_URL}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    const programmaticKeywordPages: MetadataRoute.Sitemap = SEO_KEYWORDS.map((keyword) => (
        {

            url: `${BASE_URL}/${keyword}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,

        }
    ));
    const programmaticPages: MetadataRoute.Sitemap = SEO_KEYWORDS.flatMap((keyword) =>
        INDIAN_CITIES.map((city) => ({
            url: `${BASE_URL}/${keyword}/${city}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
    );

    const allPages = [
        ...corePages,
        ...featurePages,
        ...useCasePages,
        ...toolPages,
        ...programmaticKeywordPages,
        ...programmaticPages,
    ];

    // Keep first occurrence to preserve explicit static priorities.
    const uniqueByUrl = new Map<string, MetadataRoute.Sitemap[number]>();
    for (const page of allPages) {
        if (!uniqueByUrl.has(page.url)) {
            uniqueByUrl.set(page.url, page);
        }
    }

    return [...uniqueByUrl.values()];
}
