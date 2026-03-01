import { MapPin, Phone, BookOpen, Globe } from "lucide-react";
import Image from "next/image";
import PublicEnquiryForm from "@/modules/institute/components/PublicEnquiryForm";

type Course = {
    id: string;
    name: string;
    banner?: string | null;
    duration?: string | null;
    defaultFees?: number | null;
    description?: string | null;
};

type Teacher = {
    id: string;
    name: string;
    subject?: string | null;
};

type InstitutePublicViewProps = {
    slug: string;
    institute: {
        name?: string | null;
        description?: string | null;
        logo?: string | null;
        heroImage?: string | null;
        banner?: string | null;
        phone?: string | null;
        whatsapp?: string | null;
        address?: {
            addressLine1?: string | null;
            addressLine2?: string | null;
            city?: string | null;
            state?: string | null;
            region?: string | null;
            postalCode?: string | null;
            country?: string | null;
        } | null;
        website?: string | null;
        googleMapLink?: string | null;
        socialLinks?: {
            website?: string | null;
        };
        courses: Course[];
        teachers?: Teacher[];
    };
};

const FALLBACK_HERO = "https://images.unsplash.com/photo-1523240795612-9a054b0db644";

export default function InstitutePublicView({ slug, institute }: InstitutePublicViewProps) {
    const initials = (institute.name || "I").slice(0, 1).toUpperCase();
    const instituteName = institute.name || "Institute";
    const heroImage = institute.heroImage || institute.banner || FALLBACK_HERO;
    const addressText = [
        institute.address?.addressLine1,
        institute.address?.addressLine2,
        institute.address?.city,
        institute.address?.state,
        institute.address?.region,
        institute.address?.postalCode,
        institute.address?.country,
    ]
        .filter(Boolean)
        .join(", ") || "-";
    const website = institute.website || institute.socialLinks?.website || null;

    const whatsappRaw = institute.whatsapp || institute.phone || "";
    const whatsappDigits = whatsappRaw.replace(/\D/g, "");
    const whatsapp = whatsappDigits.length === 10
        ? `91${whatsappDigits}`
        : whatsappDigits.length === 12 && whatsappDigits.startsWith("91")
            ? whatsappDigits
            : null;

    const mapLink = institute.googleMapLink
        || (addressText !== "-"
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`
            : null);

    return (
        <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
            <section className="relative overflow-hidden rounded-xl border">
                <Image
                    src={heroImage}
                    alt={`${instituteName} cover`}
                    width={1200}
                    height={400}
                    unoptimized
                    className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                    {institute.logo ? (
                        <Image
                            src={institute.logo}
                            alt={`${instituteName} logo`}
                            width={70}
                            height={70}
                            unoptimized
                            className="h-16 w-16 rounded-xl border bg-white object-cover"
                        />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl border bg-white text-lg font-semibold text-foreground">
                            {initials}
                        </div>
                    )}
                    <div className="text-white">
                        <h1 className="text-3xl font-bold">{instituteName}</h1>
                        <p className="text-sm opacity-90">{[institute.address?.city, institute.address?.state].filter(Boolean).join(" ")}</p>
                    </div>
                </div>
            </section>

            <section className="space-y-2">
                <h2 className="text-xl font-semibold">About Institute</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {institute.description || "Admissions are open. Contact institute for details."}
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <BookOpen className="h-5 w-5" />
                    Courses
                </h2>
                {institute.courses.length === 0 ? (
                    <div className="rounded-lg border p-6 text-center text-muted-foreground">
                        No courses available yet.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {institute.courses.map((course) => (
                            <div key={course.id} className="overflow-hidden rounded-lg border">
                                {course.banner ? (
                                    <Image
                                        src={course.banner}
                                        alt={course.name}
                                        width={600}
                                        height={200}
                                        unoptimized
                                        className="h-36 w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-36 w-full bg-linear-to-r from-indigo-500/20 via-violet-500/20 to-sky-500/20" />
                                )}
                                <div className="space-y-1 p-4">
                                    <p className="font-semibold">{course.name}</p>
                                    <p className="text-sm text-muted-foreground">{course.description || "-"}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {course.duration || "Duration N/A"}
                                        {course.defaultFees != null && ` • ₹${course.defaultFees.toLocaleString("en-IN")}`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {institute.teachers?.length ? (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Teachers</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                        {institute.teachers.map((teacher) => (
                            <div key={teacher.id} className="rounded-lg border p-4">
                                <p className="font-medium">{teacher.name}</p>
                                <p className="text-sm text-muted-foreground">{teacher.subject || "Teacher"}</p>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            <section className="space-y-2">
                <h2 className="text-xl font-semibold">Contact</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {institute.phone || "-"}</p>
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {addressText}</p>
                    {website && (
                        <p className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <a href={website} target="_blank" rel="noopener noreferrer" className="underline">
                                Visit Website
                            </a>
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                    {whatsapp && (
                        <a
                            href={`https://wa.me/${whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                        >
                            Chat on WhatsApp
                        </a>
                    )}
                    {mapLink && (
                        <a
                            href={mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg border px-4 py-2"
                        >
                            View on Map
                        </a>
                    )}
                </div>
            </section>

            <section>
                <PublicEnquiryForm slug={slug} />
            </section>
        </main>
    );
}
