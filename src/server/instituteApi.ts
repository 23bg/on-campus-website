import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/utils/error";

const normalizeSlug = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

const toAddressObject = (
    payload: {
        address?:
            | {
                addressLine1?: string;
                addressLine2?: string;
                city?: string;
                state?: string;
                region?: string;
                postalCode?: string;
                country?: string;
                countryCode?: string;
            }
            | string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        region?: string;
        postalCode?: string;
        country?: string;
        countryCode?: string;
    }
) => {
    if (typeof payload.address === "object" && payload.address !== null) {
        return payload.address;
    }

    return {
        addressLine1: payload.addressLine1 ?? (typeof payload.address === "string" ? payload.address : undefined),
        addressLine2: payload.addressLine2,
        city: payload.city,
        state: payload.state,
        region: payload.region,
        postalCode: payload.postalCode,
        country: payload.country,
        countryCode: payload.countryCode,
    };
};

const buildProfileUpdateData = (payload: Record<string, unknown>) => {
    const socialLinks = (payload.socialLinks as Record<string, string> | undefined) ?? {};
    const typedPayload = payload as {
        name?: string;
        slug?: string;
        description?: string;
        phone?: string;
        whatsapp?: string;
        timings?: string;
        logo?: string;
        logoUrl?: string;
        faviconUrl?: string;
        primaryColor?: string;
        customDomain?: string;
        banner?: string;
        heroImage?: string;
        googleMapLink?: string;
        websiteUrl?: string;
        instagramUrl?: string;
        facebookUrl?: string;
        youtubeUrl?: string;
        linkedinUrl?: string;
        address?: {
            addressLine1?: string;
            addressLine2?: string;
            city?: string;
            state?: string;
            region?: string;
            postalCode?: string;
            country?: string;
            countryCode?: string;
        } | string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        region?: string;
        postalCode?: string;
        country?: string;
        countryCode?: string;
    };

    const address = toAddressObject(typedPayload);

    return {
        ...(typedPayload.name !== undefined ? { name: typedPayload.name.trim() || null } : {}),
        ...(typedPayload.slug !== undefined ? { slug: normalizeSlug(typedPayload.slug) || null } : {}),
        ...(typedPayload.description !== undefined ? { description: typedPayload.description.trim() || null } : {}),
        ...(typedPayload.phone !== undefined ? { phone: typedPayload.phone.trim() || null } : {}),
        ...(typedPayload.whatsapp !== undefined ? { whatsapp: typedPayload.whatsapp.trim() || null } : {}),
        ...(typedPayload.timings !== undefined ? { timings: typedPayload.timings.trim() || null } : {}),
        ...(typedPayload.logo !== undefined ? { logo: typedPayload.logo.trim() || null } : {}),
        ...(typedPayload.logoUrl !== undefined ? { logoUrl: typedPayload.logoUrl.trim() || null } : {}),
        ...(typedPayload.faviconUrl !== undefined ? { faviconUrl: typedPayload.faviconUrl.trim() || null } : {}),
        ...(typedPayload.primaryColor !== undefined ? { primaryColor: typedPayload.primaryColor.trim() || null } : {}),
        ...(typedPayload.customDomain !== undefined
            ? { customDomain: typedPayload.customDomain.trim().toLowerCase() || null }
            : {}),
        ...(typedPayload.banner !== undefined ? { banner: typedPayload.banner.trim() || null } : {}),
        ...(typedPayload.heroImage !== undefined ? { heroImage: typedPayload.heroImage.trim() || null } : {}),
        ...(typedPayload.googleMapLink !== undefined ? { googleMapLink: typedPayload.googleMapLink.trim() || null } : {}),
        ...(typedPayload.websiteUrl !== undefined || socialLinks.website !== undefined
            ? { websiteUrl: (typedPayload.websiteUrl ?? socialLinks.website)?.trim() || null }
            : {}),
        ...(typedPayload.instagramUrl !== undefined || socialLinks.instagram !== undefined
            ? { instagramUrl: (typedPayload.instagramUrl ?? socialLinks.instagram)?.trim() || null }
            : {}),
        ...(typedPayload.facebookUrl !== undefined || socialLinks.facebook !== undefined
            ? { facebookUrl: (typedPayload.facebookUrl ?? socialLinks.facebook)?.trim() || null }
            : {}),
        ...(typedPayload.youtubeUrl !== undefined || socialLinks.youtube !== undefined
            ? { youtubeUrl: (typedPayload.youtubeUrl ?? socialLinks.youtube)?.trim() || null }
            : {}),
        ...(typedPayload.linkedinUrl !== undefined || socialLinks.linkedin !== undefined
            ? { linkedinUrl: (typedPayload.linkedinUrl ?? socialLinks.linkedin)?.trim() || null }
            : {}),
        address: {
            set: {
                addressLine1: address.addressLine1?.trim() || null,
                addressLine2: address.addressLine2?.trim() || null,
                city: address.city?.trim() || null,
                state: address.state?.trim() || null,
                region: address.region?.trim() || null,
                postalCode: address.postalCode?.trim() || null,
                country: address.country?.trim() || "India",
                countryCode: address.countryCode?.trim() || null,
            },
        },
    };
};

const getOrCreateInstituteForUser = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    if (user.instituteId) {
        const institute = await prisma.institute.findUnique({ where: { id: user.instituteId } });
        if (institute) {
            return institute;
        }
    }

    const created = await prisma.institute.create({
        data: {
            name: null,
            slug: `temp-${Date.now().toString(36)}`,
            isOnboarded: false,
        },
    });

    await prisma.user.update({ where: { id: user.id }, data: { instituteId: created.id } });
    return created;
};

export const instituteService = {
    async getInstitute(userId: string) {
        return getOrCreateInstituteForUser(userId);
    },

    async getOverview(instituteId: string) {
        const institute = await prisma.institute.findUnique({ where: { id: instituteId } });
        if (!institute) {
            throw new AppError("Institute not found", 404, "INSTITUTE_NOT_FOUND");
        }
        return institute;
    },

    async updateProfile(instituteId: string, payload: Record<string, unknown>) {
        await this.getOverview(instituteId);
        const data = buildProfileUpdateData(payload);
        return prisma.institute.update({
            where: { id: instituteId },
            data,
        });
    },

    async completeOnboarding(instituteId: string, payload: Record<string, unknown>) {
        const baseData = buildProfileUpdateData(payload);
        return prisma.institute.update({
            where: { id: instituteId },
            data: {
                ...baseData,
                isOnboarded: true,
                slug:
                    (payload.name && typeof payload.name === "string" && normalizeSlug(payload.name)) ||
                    undefined,
            },
        });
    },

    async getDomainSettings(instituteId: string) {
        const institute = await this.getOverview(instituteId);
        return {
            slug: institute.slug,
            customDomain: institute.customDomain ?? "",
            domainVerified: Boolean(institute.domainVerified),
            domainStatus: institute.domainStatus,
            defaultDomain: institute.slug ? `${institute.slug}.oncampus.in` : "",
        };
    },

    async saveCustomDomain(instituteId: string, customDomain: string, surface = "portal") {
        const host = customDomain.trim().toLowerCase();
        if (!host) {
            throw new AppError("Custom domain is required", 400, "CUSTOM_DOMAIN_REQUIRED");
        }

        await prisma.institute.update({
            where: { id: instituteId },
            data: { customDomain: host, domainVerified: false, domainStatus: "PENDING" },
        });

        await prisma.instituteDomain.upsert({
            where: { host },
            create: { instituteId, host, surface, status: "PENDING", active: false },
            update: { instituteId, surface, status: "PENDING", active: false },
        });

        return this.getDomainSettings(instituteId);
    },

    async verifyCustomDomain(instituteId: string, customDomain?: string) {
        const institute = await this.getOverview(instituteId);
        const host = (customDomain || institute.customDomain || "").trim().toLowerCase();
        if (!host) {
            throw new AppError("No custom domain configured", 400, "CUSTOM_DOMAIN_REQUIRED");
        }

        await prisma.institute.update({
            where: { id: instituteId },
            data: { customDomain: host, domainVerified: false, domainStatus: "PENDING" },
        });

        return {
            verified: false,
            host,
            nextStep: "DNS verification is pending for this domain.",
        };
    },

    async activateCustomDomain(instituteId: string, customDomain?: string) {
        const institute = await this.getOverview(instituteId);
        const host = (customDomain || institute.customDomain || "").trim().toLowerCase();
        if (!host) {
            throw new AppError("No custom domain configured", 400, "CUSTOM_DOMAIN_REQUIRED");
        }

        if (!institute.domainVerified) {
            throw new AppError("Domain must be verified before activation", 400, "DOMAIN_NOT_VERIFIED");
        }

        await prisma.institute.update({
            where: { id: instituteId },
            data: { customDomain: host, domainStatus: "ACTIVE" },
        });

        await prisma.instituteDomain.upsert({
            where: { host },
            create: { instituteId, host, surface: "portal", status: "ACTIVE", active: true },
            update: { instituteId, surface: "portal", status: "ACTIVE", active: true },
        });

        return this.getDomainSettings(instituteId);
    },

    async getPublicPage(slug: string) {
        const institute = await prisma.institute.findUnique({ where: { slug } });
        if (!institute) {
            throw new AppError("Institute not found", 404, "INSTITUTE_NOT_FOUND");
        }

        const [courses, teachers, batches, announcements, studentsCount] = await Promise.all([
            prisma.course.findMany({ where: { instituteId: institute.id }, orderBy: { createdAt: "desc" } }),
            prisma.user.findMany({
                where: { instituteId: institute.id },
                select: { id: true, name: true, subject: true, bio: true },
            }),
            prisma.batch.findMany({ where: { instituteId: institute.id }, orderBy: { createdAt: "desc" }, take: 10 }),
            prisma.studentAnnouncement.findMany({
                where: { instituteId: institute.id },
                orderBy: { createdAt: "desc" },
                take: 25,
            }),
            prisma.student.count({ where: { instituteId: institute.id } }),
        ]);

        return {
            ...institute,
            courses,
            teachers: teachers.map((teacher) => ({
                id: teacher.id,
                name: teacher.name ?? "Teacher",
                subject: teacher.subject,
                experience: teacher.bio,
            })),
            batches,
            announcements: announcements.map((announcement) => ({
                title: announcement.title,
                body: announcement.body,
                createdAt: announcement.createdAt.toISOString(),
            })),
            studentsCount,
        };
    },
};
