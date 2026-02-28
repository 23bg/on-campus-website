import Footer from "@/components/landing/Footer";
import LandingHeader from "@/components/landing/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LandingHeader />
            {children}
            <Footer />
        </>
    );
}
