import type { Metadata } from "next";
import Pricing from "../../../components/landing/Pricing";
import CTA from "../../../components/landing/CTA";

export const metadata: Metadata = {
    title: "Pricing - OnCampus",
    description: "Simple plans for coaching institutes: Solo ₹499/month or Team ₹999/month.",
};

export default function PricingPage() {
    return (
        <main>
            <Pricing />
            <CTA />
        </main>
    );
}

