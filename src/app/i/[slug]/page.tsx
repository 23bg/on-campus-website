import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { instituteService } from "@/features/institute/services/institute.service";
import InstitutePublicView from "@/modules/institute/components/InstitutePublicView";

type InstituteSlugPageProps = {
    params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

const getPublicInstitute = cache(async (slug: string) => {
    return instituteService.getPublicPage(slug);
});

export async function generateMetadata({ params }: InstituteSlugPageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const institute = await getPublicInstitute(slug);
        const instituteName = institute.name?.trim() || "Institute";
        const city = institute.address?.city?.trim() || "your city";
        const topCourses = institute.courses
            .map((course) => course.name)
            .filter((courseName): courseName is string => Boolean(courseName?.trim()))
            .slice(0, 3)
            .join(" and ");
        const description = `${instituteName} is a top coaching institute in ${city} offering ${topCourses || "NEET and JEE"} courses. Admissions open.`;
        const logo = (institute.branding?.logoUrl || institute.logo || "").trim();
        const favicon = (institute.branding?.faviconUrl || logo || "").trim();

        return {
            title: `${instituteName} | Coaching Institute in ${city}`,
            description,
            ...(favicon
                ? {
                    icons: {
                        icon: [{ url: favicon }],
                        shortcut: [{ url: favicon }],
                        apple: [{ url: favicon }],
                    },
                }
                : {}),
        };
    } catch {
        return {
            title: "Institute | Coaching Institute",
        };
    }
}

export default async function InstituteSlugPage({ params }: InstituteSlugPageProps) {
    const { slug } = await params;
    const institute = await getPublicInstitute(slug).catch(() => notFound());

    return <InstitutePublicView slug={slug} institute={institute} />;
}
