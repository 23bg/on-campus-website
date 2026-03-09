import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
    allowedDevOrigins: ["127.0.0.1"],
    async redirects() {
        return [
            {
                source: "/admission-crm-:city",
                destination: "/solutions/admission-crm/:city",
                permanent: true,
            },
            {
                source: "/student-management-software-:city",
                destination: "/solutions/student-management-software/:city",
                permanent: true,
            },
            {
                source: "/coaching-institute-crm-:city",
                destination: "/solutions/coaching-institute-crm/:city",
                permanent: true,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
