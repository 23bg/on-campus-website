import type { Metadata } from "next";
import Pricing from "../../../components/landing/Pricing";
import CTA from "../../../components/landing/CTA";
import Footer from "../../../components/landing/Footer";
import LandingHeader from "@/components/landing/Header";

export const metadata: Metadata = {
    title: "Pricing - OnCampus",
    description: "Simple â‚¹999/month pricing for coaching institutes.",
};

export default function PricingPage() {
    return (
        <>
            <LandingHeader />
            <Pricing />
            <CTA />
            <Footer />
        </>
    );
}

