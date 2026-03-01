import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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

    return {
        title: t("landingMetaTitle"),
        description: t("landingMetaDescription"),
    };
}

export default function LandingPage() {
    return (
        <main className="dark:bg-zinc-900">
            <LandingHeader />
            <Hero />
            <Problem />
            <Solution />
            <Features />
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

