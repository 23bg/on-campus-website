"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { API } from "@/constants/api";
import InstituteProfileView from "@/modules/institute/components/InstituteProfileView";
import InstituteProfileForm, { InstituteFormValues as InstituteFormState } from "@/modules/institute/forms/InstituteProfileForm";

const emptyForm: InstituteFormState = {
    name: "",
    slug: "",
    description: "",
    phone: "",
    whatsapp: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    region: "",
    postalCode: "",
    country: "India",
    countryCode: "",
    timings: "",
    logo: "",
    banner: "",
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "",
};

export default function InstitutePage() {
    const [mode, setMode] = useState<"view" | "edit">("view");
    const [form, setForm] = useState<InstituteFormState>(emptyForm);
    const [studentsCount, setStudentsCount] = useState(0);
    const [coursesCount, setCoursesCount] = useState(0);

    const load = async () => {
        const [instituteRes, studentsRes, coursesRes] = await Promise.all([
            api.get(API.INTERNAL.INSTITUTE.ROOT),
            api.get(API.INTERNAL.STUDENTS.ROOT),
            api.get(API.INTERNAL.COURSES.ROOT),
        ]);

        const institute = instituteRes.data?.data ?? {};
        setStudentsCount((studentsRes.data?.data ?? []).length);
        setCoursesCount((coursesRes.data?.data ?? []).length);

        setForm({
            name: institute.name ?? "",
            slug: institute.slug ?? "",
            description: institute.description ?? "",
            phone: institute.phone ?? "",
            whatsapp: institute.whatsapp ?? "",
            addressLine1: institute.address?.addressLine1 ?? "",
            addressLine2: institute.address?.addressLine2 ?? "",
            city: institute.address?.city ?? "",
            state: institute.address?.state ?? "",
            region: institute.address?.region ?? "",
            postalCode: institute.address?.postalCode ?? "",
            country: institute.address?.country ?? "India",
            countryCode: institute.address?.countryCode ?? "",
            timings: institute.timings ?? "",
            logo: institute.logo ?? "",
            banner: institute.banner ?? "",
            website: institute.socialLinks?.website ?? "",
            instagram: institute.socialLinks?.instagram ?? "",
            facebook: institute.socialLinks?.facebook ?? "",
            youtube: institute.socialLinks?.youtube ?? "",
            linkedin: institute.socialLinks?.linkedin ?? "",
        });
    };

    useEffect(() => {
        load();
    }, []);

    if (mode === "edit") {
        return (
            <main className="p-6">
                <InstituteProfileForm
                    initialValues={form}
                    onCancel={() => setMode("view")}
                    onSaved={async () => {
                        await load();
                        setMode("view");
                    }}
                />
            </main>
        );
    }

    return (
        <main className="p-6">
            <InstituteProfileView
                data={{
                    name: form.name,
                    slug: form.slug,
                    description: form.description,
                    phone: form.phone,
                    address: [
                        form.addressLine1,
                        form.addressLine2,
                        form.city,
                        form.state,
                        form.region,
                        form.postalCode,
                        form.country,
                    ]
                        .filter((value) => Boolean(value && value.trim().length > 0))
                        .join(", "),
                    website: form.website,
                    logo: form.logo,
                    banner: form.banner,
                    studentsCount,
                    coursesCount,
                }}
                onEdit={() => setMode("edit")}
            />
        </main>
    );
}
