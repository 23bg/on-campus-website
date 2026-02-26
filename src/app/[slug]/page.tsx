import { instituteService } from "@/features/institute/services/institute.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Globe, Phone, BookOpen } from "lucide-react";

interface InstitutePageProps {
    params: Promise<{ slug: string }>;
}

export default async function InstitutePublicPage({ params }: InstitutePageProps) {
    const { slug } = await params;

    let institute;
    try {
        institute = await instituteService.getPublicPage(slug);
    } catch {
        notFound();
    }

    const socialLinks = {
        website: institute.socialLinks?.website,
        instagram: institute.socialLinks?.instagram,
        facebook: institute.socialLinks?.facebook,
        youtube: institute.socialLinks?.youtube,
        linkedin: institute.socialLinks?.linkedin,
    };

    return (
        <main className="mx-auto max-w-4xl px-4 py-10">
            {/* Header */}
            <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight">{institute.name}</h1>
                {institute.description ? (
                    <p className="text-lg text-muted-foreground">{institute.description}</p>
                ) : null}
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
                {institute.whatsapp ? (
                    <a
                        href={`https://wa.me/91${institute.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                    >
                        <Phone className="h-4 w-4" /> WhatsApp
                    </a>
                ) : null}
                <Link
                    href={`/${slug}/lead`}
                    className="inline-flex items-center gap-2 rounded-md border border-primary px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                >
                    Fill Enquiry Form
                </Link>
            </div>

            {/* Info Grid */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 text-sm">
                {institute.address ? (
                    <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{institute.address}</span>
                    </div>
                ) : null}
                {(institute.city || institute.state) ? (
                    <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{[institute.city, institute.state].filter(Boolean).join(", ")}</span>
                    </div>
                ) : null}
                {institute.timings ? (
                    <div className="flex items-start gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{institute.timings}</span>
                    </div>
                ) : null}
                {socialLinks.website ? (
                    <div className="flex items-start gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4 mt-0.5 shrink-0" />
                        <a href={socialLinks.website} target="_blank" rel="noreferrer" className="hover:underline">{socialLinks.website}</a>
                    </div>
                ) : null}
            </div>

            {/* Social Links */}
            {(socialLinks.instagram || socialLinks.facebook || socialLinks.youtube || socialLinks.linkedin) ? (
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                    {socialLinks.instagram ? <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-pink-600 hover:underline">Instagram</a> : null}
                    {socialLinks.facebook ? <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Facebook</a> : null}
                    {socialLinks.youtube ? <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="text-red-600 hover:underline">YouTube</a> : null}
                    {socialLinks.linkedin ? <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">LinkedIn</a> : null}
                </div>
            ) : null}

            {/* Courses */}
            <section className="mt-10">
                <h2 className="text-xl font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5" /> Courses Offered</h2>
                {institute.courses.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">No courses listed yet.</p>
                ) : (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {institute.courses.map((course: { id: string; name: string; duration?: string | null; defaultFees?: number | null; description?: string | null }) => (
                            <div key={course.id} className="rounded-lg border p-4 space-y-1">
                                <p className="font-medium">{course.name}</p>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    {course.duration ? <span>{course.duration}</span> : null}
                                    {course.defaultFees != null ? <span>₹{course.defaultFees.toLocaleString("en-IN")}</span> : null}
                                </div>
                                {course.description ? <p className="text-xs text-muted-foreground">{course.description}</p> : null}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Teachers */}
            <section className="mt-10">
                <h2 className="text-xl font-semibold">Our Faculty</h2>
                {institute.teachers.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">No teachers listed yet.</p>
                ) : (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {institute.teachers.map((teacher: { id: string; name: string; subject?: string | null; bio?: string | null }) => (
                            <div key={teacher.id} className="rounded-lg border p-4 space-y-1">
                                <p className="font-medium">{teacher.name}</p>
                                <p className="text-sm text-muted-foreground">{teacher.subject ?? "Faculty"}</p>
                                {teacher.bio ? <p className="text-xs text-muted-foreground">{teacher.bio}</p> : null}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
