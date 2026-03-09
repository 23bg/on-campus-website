import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";

const CITIES = ["pune", "mumbai", "delhi", "bangalore", "hyderabad"] as const;

type CityPageProps = {
    params: Promise<{ city: string }>;
};

export function generateStaticParams() {
    return CITIES.map((city) => ({ city }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const { city } = await params;
    const cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    const title = `Admission CRM in ${cityName} for Coaching Institutes`;
    const description = `OnCampus helps coaching institutes in ${cityName} manage enquiries, admissions, students, and fees in one platform.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/crm/${city.toLowerCase()}`,
        },
        openGraph: {
            title,
            description,
            url: `/crm/${city.toLowerCase()}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function CrmCityPage({ params }: CityPageProps) {
    const { city } = await params;
    const cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    return (
        <SeoLandingPage
            title={`Admission CRM in ${cityName} for Coaching Institutes`}
            problem={`Coaching institutes in ${cityName} often manage admissions through scattered calls, chats, and spreadsheets.`}
            solution={`OnCampus gives institutes in ${cityName} one platform for enquiry tracking, admissions, students, and fees.`}
            features={[
                "Capture enquiries from forms, links, and QR",
                "Track follow-ups and admission stages",
                "Maintain student and course records",
                "Track installments and payments",
            ]}
            faqs={[
                { q: `Is this suitable for institutes in ${cityName}?`, a: "Yes, it is built for Indian coaching institute workflows." },
                { q: "Can small teams use it?", a: "Yes, plans support solo owners and admission teams." },
            ]}
        />
    );
}
