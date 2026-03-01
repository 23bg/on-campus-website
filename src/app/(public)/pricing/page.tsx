import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Pricing from "../../../components/landing/Pricing";
import CTA from "../../../components/landing/CTA";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("pages");

    return {
        title: t("pricingMetaTitle"),
        description: t("pricingMetaDescription"),
    };
}

export default function PricingPage() {
    return (
        <main>
            <Pricing />
            <CTA />
        </main>
    );
}

