import type { Metadata } from "next";
import "@/styles/globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/theme-provider";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <body>
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
              position={"top-center"}
              richColors
              expand={false}
            />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

