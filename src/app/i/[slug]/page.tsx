import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { instituteService } from "@/features/institute/services/institute.service";
import InstitutePublicView from "@/modules/institute/components/InstitutePublicView";

type InstituteSlugPageProps = {
    params: Promise<{ slug: string }>;
};

const getPublicInstitute = cache(async (slug: string) => {
    return instituteService.getPublicPage(slug);
});

export async function generateMetadata({ params }: InstituteSlugPageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const institute = await getPublicInstitute(slug);
        const title = institute.name?.trim() || "Institute";
        const logo = institute.logo?.trim();

        return {
            title,
            ...(logo
                ? {
                    icons: {
                        icon: [{ url: logo }],
                        shortcut: [{ url: logo }],
                        apple: [{ url: logo }],
                    },
                }
                : {}),
        };
    } catch {
        return {
            title: "Institute",
        };
    }
}

export default async function InstituteSlugPage({ params }: InstituteSlugPageProps) {
    const { slug } = await params;
    const institute = await getPublicInstitute(slug).catch(() => notFound());

    return <InstitutePublicView slug={slug} institute={institute} />;
}
