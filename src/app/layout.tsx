import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "OnCampus - Admission CRM for Coaching Institutes",
  description:
    "OnCampus helps coaching institutes capture enquiries and manage student admissions.",
};

// ensureInitialUser();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <ReduxProvider>
            <NextTopLoader
              showSpinner={false}
              color="#00BF63"
              shadow={false}
            />
            <main>{children}</main>
            <Toaster
              duration={3000}
              position={"bottom-right"}
            />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

