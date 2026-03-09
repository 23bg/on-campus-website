import {
    BookOpen,
    Clock3,
    Globe,
    MapPin,
    MessageCircle,
    Phone,
    Star,
    Trophy
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import PublicEnquiryForm from "@/modules/institute/components/PublicEnquiryForm";

const FALLBACK_HERO =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644";

export default function InstitutePublicView({ slug, institute }: any) {
    const instituteName = institute.name || "Institute";

    const heroImage =
        institute.heroImage ||
        institute.banner ||
        FALLBACK_HERO;

    const addressText = [
        institute.address?.addressLine1,
        institute.address?.city,
        institute.address?.state
    ]
        .filter(Boolean)
        .join(", ");

    const whatsappRaw =
        institute.whatsapp || institute.phone || "";

    const whatsappDigits =
        whatsappRaw.replace(/\D/g, "");

    const whatsapp =
        whatsappDigits.length === 10
            ? `91${whatsappDigits}`
            : whatsappDigits;

    const establishedYear =
        institute.createdAt
            ? new Date(institute.createdAt).getFullYear()
            : "N/A";

    const mode =
        institute.timings?.toLowerCase().includes("online")
            ? "Online"
            : "Offline";

    const website =
        institute.website ||
        institute.socialLinks?.website;

    return (
        <Dialog>
            <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">


                {/* HERO */}

                <section className="relative overflow-hidden rounded-2xl border">

                    <Image
                        src={heroImage}
                        alt="hero"
                        width={1200}
                        height={400}
                        className="h-72 w-full object-cover"
                        unoptimized
                    />

                    <div className="absolute inset-0 bg-black/50" />

                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">


                        <div className="space-y-2 text-white">

                            <h1 className="text-4xl font-bold">
                                {instituteName}
                            </h1>

                            <p className="text-white/80">
                                {addressText}
                            </p>

                            <Badge className="bg-primary text-white">
                                Admissions Open
                            </Badge>

                        </div>


                        <div className="flex gap-2">

                            {institute.phone && (
                                <Button asChild size="sm">
                                    <a href={`tel:${institute.phone}`}>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call
                                    </a>
                                </Button>
                            )}

                            {whatsapp && (
                                <Button asChild variant="secondary" size="sm">
                                    <a
                                        href={`https://wa.me/${whatsapp}`}
                                        target="_blank"
                                    >
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        WhatsApp
                                    </a>
                                </Button>
                            )}

                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                    Enquiry
                                </Button>
                            </DialogTrigger>

                        </div>

                    </div>

                </section>


                {/* ABOUT + INFO */}

                <section className="grid gap-8 md:grid-cols-3">

                    <div className="space-y-4 md:col-span-2">

                        <h2>About Institute</h2>

                        <p className="text-muted-foreground leading-7">

                            {institute.description ||
                                "Admissions open. Contact institute for details."}

                        </p>

                    </div>


                    <div className="rounded-xl border p-5 space-y-3 text-sm">

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Established
                            </span>

                            <span>
                                {establishedYear}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Students
                            </span>

                            <span>
                                {institute.studentsCount || "N/A"}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Mode
                            </span>

                            <span>
                                {mode}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                City
                            </span>

                            <span>
                                {institute.address?.city || "N/A"}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                State
                            </span>

                            <span>
                                {institute.address?.state || "N/A"}
                            </span>
                        </div>

                        {website && (
                            <a
                                href={website}
                                target="_blank"
                                className="block pt-2 underline"
                            >
                                Visit Website
                            </a>
                        )}

                    </div>

                </section>



                {/* COURSES */}

                <section className="space-y-6">

                    <h2 className="flex items-center gap-2">

                        <BookOpen className="h-5 w-5" />
                        Courses

                    </h2>


                    {institute.courses.length === 0 ? (

                        <div className="border rounded-xl p-6 text-center text-muted-foreground">

                            No courses available

                        </div>

                    ) : (

                        <div className="grid gap-6 md:grid-cols-2">

                            {institute.courses.map((course: any) => (

                                <div
                                    key={course.id}
                                    className="rounded-xl border overflow-hidden"
                                >

                                    {course.banner && (

                                        <Image
                                            src={course.banner}
                                            alt=""
                                            width={600}
                                            height={200}
                                            className="h-40 w-full object-cover"
                                            unoptimized
                                        />

                                    )}

                                    <div className="p-5 space-y-3">

                                        <h3>{course.name}</h3>

                                        <div className="text-sm text-muted-foreground space-y-1">

                                            <p>
                                                Duration:
                                                {" "}
                                                {course.duration || "N/A"}
                                            </p>

                                            <p>
                                                Fees:
                                                {" "}
                                                {course.defaultFees
                                                    ? `₹${course.defaultFees}`
                                                    : "N/A"}
                                            </p>

                                        </div>

                                        <DialogTrigger asChild>
                                            <Button size="sm">
                                                Enquire
                                            </Button>
                                        </DialogTrigger>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>



                {/* LOCATION */}

                <section className="space-y-4">

                    <h2 className="flex gap-2">

                        <MapPin className="h-5 w-5" />
                        Location

                    </h2>

                    <div className="border rounded-xl p-5 space-y-3">

                        <p>{addressText}</p>

                        <div className="flex gap-3">

                            {whatsapp && (

                                <Button asChild>

                                    <a
                                        href={`https://wa.me/${whatsapp}`}
                                        target="_blank"
                                    >
                                        WhatsApp
                                    </a>

                                </Button>

                            )}

                        </div>

                    </div>

                </section>


                <section className="rounded-2xl border bg-muted/30 p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-primary">Powered by OnCampus</p>
                            <h3 className="text-xl font-semibold">Run admissions and student operations with OnCampus</h3>
                            <p className="text-sm text-muted-foreground">
                                Capture enquiries, manage students, and launch your institute page in minutes.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href="/signup">Start Free Trial</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/demo-institute">View Demo</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Send Enquiry</DialogTitle>
                    <DialogDescription>
                        Share your details and the institute will contact you soon.
                    </DialogDescription>
                </DialogHeader>
                <PublicEnquiryForm slug={slug} />
            </DialogContent>
        </Dialog>
    );
}

// import { BookOpen, Clock3, Globe, MapPin, MessageCircle, Phone, Star, Trophy } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import PublicEnquiryForm from "@/modules/institute/components/PublicEnquiryForm";

// type Course = {
//     id: string;
//     name: string;
//     banner?: string | null;
//     duration?: string | null;
//     defaultFees?: number | null;
//     description?: string | null;
// };

// type Teacher = {
//     id: string;
//     name: string;
//     subject?: string | null;
//     experience?: string | null;
// };

// type Batch = {
//     id: string;
//     name: string;
//     schedule?: string | null;
//     startDate?: Date | null;
// };

// type InstitutePublicViewProps = {
//     slug: string;
//     institute: {
//         name?: string | null;
//         description?: string | null;
//         logo?: string | null;
//         heroImage?: string | null;
//         banner?: string | null;
//         phone?: string | null;
//         whatsapp?: string | null;
//         address?: {
//             addressLine1?: string | null;
//             addressLine2?: string | null;
//             city?: string | null;
//             state?: string | null;
//             region?: string | null;
//             postalCode?: string | null;
//             country?: string | null;
//         } | null;
//         website?: string | null;
//         googleMapLink?: string | null;
//         socialLinks?: {
//             website?: string | null;
//         };
//         timings?: string | null;
//         createdAt?: Date;
//         studentsCount?: number;
//         courses: Course[];
//         teachers?: Teacher[];
//         batches?: Batch[];
//         photos?: string[];
//     };
// };

// const FALLBACK_HERO = "https://images.unsplash.com/photo-1523240795612-9a054b0db644";

// export default function InstitutePublicView({ slug, institute }: InstitutePublicViewProps) {
//     const initials = (institute.name || "I").slice(0, 1).toUpperCase();
//     const instituteName = institute.name || "Institute";
//     const heroImage = institute.heroImage || institute.banner || FALLBACK_HERO;
//     const addressText = [
//         institute.address?.addressLine1,
//         institute.address?.addressLine2,
//         institute.address?.city,
//         institute.address?.state,
//         institute.address?.region,
//         institute.address?.postalCode,
//         institute.address?.country,
//     ]
//         .filter(Boolean)
//         .join(", ") || "-";
//     const website = institute.website || institute.socialLinks?.website || null;
//     const admissionOpen = true;
//     const mode = institute.timings?.toLowerCase().includes("online") ? "Online" : "Offline / Hybrid";
//     const establishedYear = institute.createdAt ? new Date(institute.createdAt).getFullYear() : "N/A";

//     const whatsappRaw = institute.whatsapp || institute.phone || "";
//     const whatsappDigits = whatsappRaw.replace(/\D/g, "");
//     const whatsapp = whatsappDigits.length === 10
//         ? `91${whatsappDigits}`
//         : whatsappDigits.length === 12 && whatsappDigits.startsWith("91")
//             ? whatsappDigits
//             : null;

//     const mapLink = institute.googleMapLink
//         || (addressText !== "-"
//             ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`
//             : null);

//     return (
//         <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
//             <section className="relative overflow-hidden rounded-xl border">
//                 <Image
//                     src={heroImage}
//                     alt={`${instituteName} cover`}
//                     width={1200}
//                     height={400}
//                     unoptimized
//                     className="h-64 w-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/40" />
//                 <div className="absolute bottom-4 left-4 flex items-center gap-4">
//                     {institute.logo ? (
//                         <Image
//                             src={institute.logo}
//                             alt={`${instituteName} logo`}
//                             width={70}
//                             height={70}
//                             unoptimized
//                             className="h-16 w-16 rounded-xl border bg-white object-cover"
//                         />
//                     ) : (
//                         <div className="flex h-16 w-16 items-center justify-center rounded-xl border bg-white text-lg font-semibold text-foreground">
//                             {initials}
//                         </div>
//                     )}
//                     <div className="text-white">
//                         <h1 className="text-3xl font-bold">{instituteName}</h1>
//                         <p className="text-sm opacity-90">{[institute.address?.city, institute.address?.state].filter(Boolean).join(", ")}</p>
//                         {admissionOpen ? <Badge className="mt-2">Admission Open</Badge> : null}
//                     </div>
//                 </div>
//                 <div className="absolute right-4 bottom-4 flex flex-wrap gap-2">
//                     {institute.phone ? (
//                         <Button asChild size="sm" className="rounded-full">
//                             <a href={`tel:${institute.phone}`}>
//                                 <Phone className="h-4 w-4" />
//                                 Call
//                             </a>
//                         </Button>
//                     ) : null}
//                     {whatsapp ? (
//                         <Button asChild size="sm" variant="secondary" className="rounded-full">
//                             <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
//                                 <MessageCircle className="h-4 w-4" />
//                                 WhatsApp
//                             </a>
//                         </Button>
//                     ) : null}
//                     <Button asChild size="sm" variant="outline" className="rounded-full bg-background/90">
//                         <Link href="#enquiry">Enquiry</Link>
//                     </Button>
//                 </div>
//             </section>

//             <section className="rounded-xl border p-6">
//                 <h2 className="text-lg font-semibold">About</h2>
//                 <p className="mt-3 whitespace-pre-line  text-sm leading-7 text-muted-foreground">
//                     {institute.description || "Admissions are open. Contact institute for details."}
//                 </p>

//                 <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2 md:grid-cols-3">
//                     <div>
//                         <span className="text-muted-foreground">Established:</span>{" "}
//                         {establishedYear}
//                     </div>

//                     <div>
//                         <span className="text-muted-foreground">Total Students:</span>{" "}
//                         {institute.studentsCount ?? "N/A"}
//                     </div>

//                     <div>
//                         <span className="text-muted-foreground">Type:</span>{" "}
//                         Coaching Institute
//                     </div>

//                     <div>
//                         <span className="text-muted-foreground">Mode:</span>{" "}
//                         {mode}
//                     </div>

//                     <div>
//                         <span className="text-muted-foreground">Branches:</span>{" "}
//                         1
//                     </div>

//                     <div>
//                         <span className="text-muted-foreground">City:</span>{" "}
//                         {institute.address?.city || "N/A"}
//                     </div>

//                     <div>
//                         <span className="text-muted-foreground">State:</span>{" "}
//                         {institute.address?.state || "N/A"}
//                     </div>

//                     <div>
//                         <span className="text-muted-foreground">Website:</span>{" "}
//                         {website ? (
//                             <a
//                                 href={website}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="underline"
//                             >
//                                 Visit
//                             </a>
//                         ) : (
//                             "N/A"
//                         )}
//                     </div>
//                 </div>
//             </section>

//             <section className="space-y-4">
//                 <h2 className="flex items-center gap-2 text-xl font-semibold">
//                     <BookOpen className="h-5 w-5" />
//                     Courses
//                 </h2>
//                 {institute.courses.length === 0 ? (
//                     <div className="rounded-lg border p-6 text-center text-muted-foreground">
//                         No courses available yet.
//                     </div>
//                 ) : (
//                     <div className="grid gap-4 md:grid-cols-2">
//                         {institute.courses.map((course) => (
//                             <div key={course.id} className="overflow-hidden rounded-lg border">
//                                 {course.banner ? (
//                                     <Image
//                                         src={course.banner}
//                                         alt={course.name}
//                                         width={600}
//                                         height={200}
//                                         unoptimized
//                                         className="h-36 w-full object-cover"
//                                     />
//                                 ) : (
//                                     <div className="h-36 w-full bg-linear-to-r from-indigo-500/20 via-violet-500/20 to-sky-500/20" />
//                                 )}
//                                 <div className="space-y-2 p-4">
//                                     <p className="font-semibold">{course.name}</p>
//                                     <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
//                                         <p>Duration: {course.duration || "N/A"}</p>
//                                         <p>Fees: {course.defaultFees != null ? `₹${course.defaultFees.toLocaleString("en-IN")}` : "N/A"}</p>
//                                         <p>Mode: {mode}</p>
//                                         <p>Batch Start: Rolling</p>
//                                         <p>Seats: Limited</p>
//                                     </div>
//                                     <Button asChild size="sm" variant="outline" className="mt-1">
//                                         <Link href="#enquiry">Enquire</Link>
//                                     </Button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>

//             <section className="space-y-2">
//                 <h2 className="text-xl font-semibold">Faculty</h2>
//                 {institute.teachers?.length ? (
//                     <div className="grid gap-3 md:grid-cols-3">
//                         {institute.teachers.map((teacher) => (
//                             <div key={teacher.id} className="rounded-lg border p-4">
//                                 <div className="mb-2 h-12 w-12 rounded-full bg-muted" />
//                                 <p className="font-medium">{teacher.name}</p>
//                                 <p className="text-sm text-muted-foreground">{teacher.subject || "Subject not specified"}</p>
//                                 <p className="text-xs text-muted-foreground">{teacher.experience || "Experience details coming soon"}</p>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="text-sm text-muted-foreground">Faculty details will be published soon.</p>
//                 )}
//             </section>

//             <section className="space-y-4">
//                 <h2 className="flex items-center gap-2 text-xl font-semibold"><Trophy className="h-5 w-5" /> Results</h2>
//                 <div className="rounded-lg border p-4 text-sm text-muted-foreground">NEET 2025 — 25 Students Selected</div>
//             </section>

//             <section className="space-y-4">
//                 <h2 className="text-xl font-semibold">Photos</h2>
//                 {institute.photos?.length ? (
//                     <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
//                         {institute.photos.slice(0, 9).map((photo, index) => (
//                             <Image
//                                 key={`${photo}-${index}`}
//                                 src={photo}
//                                 alt={`${instituteName} photo ${index + 1}`}
//                                 width={400}
//                                 height={250}
//                                 unoptimized
//                                 className="h-36 w-full rounded-lg border object-cover"
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="text-sm text-muted-foreground">Photo gallery will be updated soon.</p>
//                 )}
//             </section>

//             <section className="space-y-3">
//                 <h2 className="flex items-center gap-2 text-xl font-semibold"><Star className="h-5 w-5" /> Reviews</h2>
//                 <div className="rounded-lg border p-4 text-sm text-muted-foreground">
//                     ⭐⭐⭐⭐⭐ Great teaching support and timely updates. — Student
//                 </div>
//             </section>

//             <section className="space-y-3">
//                 <h2 className="flex items-center gap-2 text-xl font-semibold"><Clock3 className="h-5 w-5" /> Batch Timing</h2>
//                 <ul className="grid gap-2 text-sm md:grid-cols-3">
//                     <li className="rounded-md border p-3">Morning</li>
//                     <li className="rounded-md border p-3">Evening</li>
//                     <li className="rounded-md border p-3">Weekend</li>
//                 </ul>
//                 {institute.batches?.length ? (
//                     <div className="text-sm text-muted-foreground">Latest: {institute.batches[0].name}{institute.batches[0].schedule ? ` • ${institute.batches[0].schedule}` : ""}</div>
//                 ) : null}
//             </section>

//             <section className="space-y-2">
//                 <h2 className="text-xl font-semibold">Location</h2>
//                 <div className="space-y-2 text-sm text-muted-foreground">
//                     <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {institute.phone || "-"}</p>
//                     <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {addressText}</p>
//                     <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Landmark: Near main market</p>
//                     {website && (
//                         <p className="flex items-center gap-2">
//                             <Globe className="h-4 w-4" />
//                             <a href={website} target="_blank" rel="noopener noreferrer" className="underline">
//                                 Visit Website
//                             </a>
//                         </p>
//                     )}
//                 </div>

//                 <div className="flex flex-wrap gap-3 pt-2">
//                     {whatsapp && (
//                         <a
//                             href={`https://wa.me/${whatsapp}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground"
//                         >
//                             Chat on WhatsApp
//                         </a>
//                     )}
//                     {mapLink && (
//                         <a
//                             href={mapLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center rounded-lg border px-4 py-2"
//                         >
//                             Open Map
//                         </a>
//                     )}
//                 </div>
//             </section>

//             <section id="enquiry">
//                 <PublicEnquiryForm slug={slug} />
//             </section>
//         </main>
//     );
// }
