import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
    title: "Coaching Institutes Near You",
    description: "Discover and compare coaching institutes by city and courses.",
    alternates: {
        canonical: "/institutes",
    },
    openGraph: {
        title: "Coaching Institutes Near You",
        description: "Discover and compare coaching institutes by city and courses.",
        url: "/institutes",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Coaching Institutes Near You",
        description: "Discover and compare coaching institutes by city and courses.",
    },
};

export const revalidate = 3600;

type InstitutesPageProps = {
    searchParams: Promise<{ city?: string; course?: string; q?: string; sort?: "popular" | "newest" }>;
};

export default function InstitutesPage() {
    return null;
}
