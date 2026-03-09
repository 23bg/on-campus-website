import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INDUSTRY_PAGE_SLUGS, PROBLEM_PAGE_SLUGS, titleFromSlug } from "@/lib/seo/programmatic";

type SeoSlugPageProps = {
    params: Promise<{ seoSlug: string }>;
};

const INDUSTRY_SET = new Set(INDUSTRY_PAGE_SLUGS);
const PROBLEM_SET = new Set(PROBLEM_PAGE_SLUGS);

function getPageType(slug: string): "industry" | "problem" | null {
    if (INDUSTRY_SET.has(slug as (typeof INDUSTRY_PAGE_SLUGS)[number])) return "industry";
    if (PROBLEM_SET.has(slug as (typeof PROBLEM_PAGE_SLUGS)[number])) return "problem";
    return null;
}

export function generateStaticParams() {
    return [...INDUSTRY_PAGE_SLUGS, ...PROBLEM_PAGE_SLUGS].map((seoSlug) => ({ seoSlug }));
}

export async function generateMetadata({ params }: SeoSlugPageProps): Promise<Metadata> {
    const { seoSlug } = await params;
    const pageType = getPageType(seoSlug);
    if (!pageType) {
        return { title: "OnCampus", robots: { index: false, follow: false } };
    }

    const readable = titleFromSlug(seoSlug);
    const title = `${readable} | OnCampus`;
    const description =
        pageType === "industry"
            ? `Discover how OnCampus supports ${readable.toLowerCase()} with enquiry, admission, student, and fee workflows.`
            : `Learn how to solve ${readable.toLowerCase()} using a practical coaching operations workflow with OnCampus.`;

    return {
        title,
        description,
        alternates: { canonical: `/${seoSlug}` },
        openGraph: { title, description, url: `/${seoSlug}`, type: "article" },
        twitter: { card: "summary_large_image", title, description },
    };
}

export default async function ProgrammaticSeoSlugPage({ params }: SeoSlugPageProps) {
    const { seoSlug } = await params;
    const pageType = getPageType(seoSlug);
    if (!pageType) notFound();

    const heading = titleFromSlug(seoSlug);

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 lg:py-16">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{heading}</h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                    {pageType === "industry"
                        ? `${heading} demands consistent admission execution, counselor follow-up discipline, and operational visibility. OnCampus helps coaching teams standardize these workflows.`
                        : `${heading} is a common bottleneck for coaching institutes. OnCampus provides a practical, measurable workflow to solve it with less manual effort.`}
                </p>
                <p>
                    Teams can capture enquiries, track admission movement, structure student records, and align fee workflows in one platform designed for Indian coaching operations.
                </p>
                <p>
                    Owners get cleaner reporting across lead quality, conversion, and fee collections, enabling faster operational decisions without juggling disconnected tools.
                </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm">
                <Link href="/admission-crm" className="text-primary underline-offset-4 hover:underline">Admission CRM</Link>
                <Link href="/features" className="text-primary underline-offset-4 hover:underline">Platform Features</Link>
                <Link href="/pricing" className="text-primary underline-offset-4 hover:underline">Pricing</Link>
            </div>
        </main>
    );
}
