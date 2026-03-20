import type { Metadata } from "next";
// import Link from "next/link";
import { getTranslations } from "next-intl/server";
import JsonLd from "@/components/seo/JsonLd";
import Hero from "@/components/landing/Hero";
import LogoStrip from "@/components/landing/LogoStrip";
import Problem from "@/components/landing/Problem";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import PricingPreview from "@/components/landing/PricingPreview";
import CTA from "@/components/landing/CTA";
import UseCases from "@/components/landing/UseCases";
import TrustBar from "@/components/landing/TrustBar";
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
        email: "support@oncampus.in",
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
            <LogoStrip />
            <Problem />
            <HowItWorks />
            <Features />
            <UseCases />
            <Testimonials />
            <PricingPreview />
            <TrustBar />
            <CTA />
            <Footer />
        </main  >
    );
}

