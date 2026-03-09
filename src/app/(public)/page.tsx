import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import JsonLd from "@/components/seo/JsonLd";
import Hero from "@/components/landing/Hero";
import Trust from "@/components/landing/Trust";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Demo from "@/components/landing/Demo";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import UseCases from "../../components/landing/UseCases";
import LandingHeader from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("pages");
    const title = t("landingMetaTitle");
    const description = t("landingMetaDescription");

    return {
        title,
        description,
        alternates: {
            canonical: "/",
        },
        openGraph: {
            title,
            description,
            url: "/",
            type: "website",
        },
        twitter: {
            title,
            description,
            card: "summary_large_image",
        },
    };
}

export default function LandingPage() {
    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "OnCampus",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: "999",
        },
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "OnCampus",
        url: "https://oncampus.in",
        email: "support@oncampus.app",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "Is there a free trial?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. You can start a free trial before choosing a paid plan.",
                },
            },
            {
                "@type": "Question",
                name: "Can I cancel anytime?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. You can cancel subscription from billing settings any time.",
                },
            },
            {
                "@type": "Question",
                name: "Do you support multi-user teams?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Team plans support multiple users with role-based access.",
                },
            },
        ],
    };

    return (
        <main className="dark:bg-zinc-900">
            <JsonLd id="schema-software-application" data={softwareAppSchema} />
            <JsonLd id="schema-organization" data={organizationSchema} />
            <JsonLd id="schema-faq" data={faqSchema} />
            <LandingHeader />
            <Hero />
            <Problem />
            <Solution />
            <Features />
            <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
                <h2 className="text-2xl font-semibold">Explore Core Product Pages</h2>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <Link href="/admission-crm" className="text-primary underline-offset-4 hover:underline">Admission CRM</Link>
                    <Link href="/student-management-software" className="text-primary underline-offset-4 hover:underline">Student Management Software</Link>
                    <Link href="/coaching-institute-crm" className="text-primary underline-offset-4 hover:underline">Coaching Institute CRM</Link>
                </div>
            </section>
            <section className="mx-auto w-full max-w-5xl px-4 py-2 pb-8 md:px-6">
                <h2 className="text-2xl font-semibold">Popular City Solutions</h2>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <Link href="/solutions/admission-crm/pune" className="text-primary underline-offset-4 hover:underline">Admission CRM in Pune</Link>
                    <Link href="/solutions/admission-crm/delhi" className="text-primary underline-offset-4 hover:underline">Admission CRM in Delhi</Link>
                    <Link href="/solutions/admission-crm/mumbai" className="text-primary underline-offset-4 hover:underline">Admission CRM in Mumbai</Link>
                </div>
            </section>
            <UseCases />
            <Trust />
            <HowItWorks />
            <Demo />
            <Pricing />
            <FAQ />
            <CTA />
            <Footer />
        </main  >
    );
}

