import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://oncampus.in";

const SEO_MATRIX_CSV_PATH = path.join(process.cwd(), "docs", "release", "SEO_PROGRAMMATIC_170_PAGES.csv");

function parseCsvLine(line: string): string[] {
    const out: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];

        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === "," && !inQuotes) {
            out.push(current);
            current = "";
        } else {
            current += ch;
        }
    }

    out.push(current);
    return out;
}

function getGeneratedSeoPages(): MetadataRoute.Sitemap {
    try {
        const raw = fs.readFileSync(SEO_MATRIX_CSV_PATH, "utf8").trim();
        if (!raw) return [];

        const lines = raw.split(/\r?\n/);
        const header = parseCsvLine(lines[0]);
        const slugIndex = header.indexOf("urlSlug");
        const typeIndex = header.indexOf("pageType");
        if (slugIndex === -1 || typeIndex === -1) return [];

        const now = new Date();

        const pages: MetadataRoute.Sitemap = [];

        for (const row of lines.slice(1).map(parseCsvLine)) {
            const slug = (row[slugIndex] || "").trim();
            const type = (row[typeIndex] || "").trim();
            if (!slug) continue;

            const changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] =
                type === "Location" ? "weekly" : "monthly";
            const priority =
                type === "Location" ? 0.7 : type === "Feature" ? 0.75 : type === "Industry" ? 0.72 : 0.7;

            pages.push({
                url: `${BASE_URL}${slug}`,
                lastModified: now,
                changeFrequency,
                priority,
            });
        }

        return pages;
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static public pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/features`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/features/lead-management`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/features/student-records`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/features/public-institute-page`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/features/subscription-billing`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/pricing`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/resources`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/use-cases`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/use-cases/jee-neet-coaching`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/use-cases/tuition-classes`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/use-cases/computer-training`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/use-cases/skill-centers`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/demo-institute`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/tools`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/tools/qr-code-generator`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/tools/link-shortener`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/tools/course-comparison`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/tools/institute-score`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/tools/templates`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/institutes`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/admission-crm`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/coaching-institute-crm`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/student-management-software`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/admission-management-software`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/student-admission-system`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/crm/pune`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/crm/mumbai`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/crm/delhi`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/crm/bangalore`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/crm/hyderabad`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ];

    const generatedSeoPages = getGeneratedSeoPages();

    // Dynamic institute pages
    let institutePages: MetadataRoute.Sitemap = [];
    try {
        const institutes = await prisma.institute.findMany({
            where: { isOnboarded: true, slug: { not: null } },
            select: { slug: true, updatedAt: true },
        });

        institutePages = institutes
            .filter((i) => i.slug)
            .map((institute) => ({
                url: `${BASE_URL}/i/${institute.slug}`,
                lastModified: institute.updatedAt,
                changeFrequency: "weekly" as const,
                priority: 0.6,
            }));
    } catch {
        // If DB is unavailable, return only static pages
    }

    const allPages = [...staticPages, ...generatedSeoPages, ...institutePages];

    // Keep first occurrence to preserve explicit static priorities.
    const uniqueByUrl = new Map<string, MetadataRoute.Sitemap[number]>();
    for (const page of allPages) {
        if (!uniqueByUrl.has(page.url)) {
            uniqueByUrl.set(page.url, page);
        }
    }

    return [...uniqueByUrl.values()];
}
