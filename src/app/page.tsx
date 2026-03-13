import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { readSessionFromCookie } from "@/lib/auth/auth";
import { instituteService } from "@/features/institute/services/institute.service";
import LandingPage from "@/modules/marketing/LandingPage";
import DashboardHome from "@/modules/dashboard/DashboardHome";
import DashboardLayout from "@/components/layout/dashboard/DashboardLayout";
import InstitutePublicView from "@/modules/institute/components/InstitutePublicView";

const getHostname = async () => {
    const headerStore = await headers();
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
    return host.split(":")[0].toLowerCase();
};

export default async function Page() {
    const session = await readSessionFromCookie();

    if (!session) {
        const hostname = await getHostname();
        if (hostname) {
            const institute = await instituteService.getByHost(hostname);
            if (institute?.slug) {
                return <InstitutePublicView slug={institute.slug} institute={institute} />;
            }
        }

        return <LandingPage />;
    }

    const institute = await instituteService.getOverview(session.instituteId);
    if (!institute.isOnboarded) {
        redirect("/onboarding");
    }

    return (
        <DashboardLayout>
            <DashboardHome />
        </DashboardLayout>
    );
}
