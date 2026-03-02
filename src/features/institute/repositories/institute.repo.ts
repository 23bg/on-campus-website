import { prisma } from "@/lib/db/prisma";

type UpdateInstituteInput = {
    name?: string;
    description?: string | null;
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
        countryCode?: string | null;
    } | null;
    timings?: string | null;
    logo?: string | null;
    banner?: string | null;
    heroImage?: string | null;
    googleMapLink?: string | null;
    websiteUrl?: string | null;
    instagramUrl?: string | null;
    facebookUrl?: string | null;
    youtubeUrl?: string | null;
    linkedinUrl?: string | null;
    isOnboarded?: boolean;
    slug?: string;
};

export const instituteRepository = {
    findById: async (id: string) => prisma.institute.findUnique({ where: { id } }),

    findBySlug: async (slug: string) => prisma.institute.findUnique({ where: { slug } }),

    isSlugTaken: async (slug: string, excludeInstituteId?: string) => {
        const existing = await prisma.institute.findUnique({ where: { slug } });
        if (!existing) return false;
        if (!excludeInstituteId) return true;
        return existing.id !== excludeInstituteId;
    },

    create: async (input: { name?: string | null; slug?: string | null; isOnboarded?: boolean }) =>
        prisma.institute.create({
            data: {
                name: input.name ?? null,
                slug: input.slug ?? null,
                isOnboarded: input.isOnboarded ?? false,
            },
        }),

    updateById: async (id: string, input: UpdateInstituteInput) =>
        prisma.institute.update({
            where: { id },
            data: (() => {
                const { address, ...rest } = input;

                if (address === undefined) {
                    return rest;
                }

                if (address === null) {
                    return {
                        ...rest,
                        address: { unset: true },
                    };
                }

                return {
                    ...rest,
                    address: { set: address },
                };
            })(),
        }),
};
