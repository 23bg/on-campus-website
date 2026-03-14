import type { Metadata } from "next";
import "@/styles/globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/theme-provider";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

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
  metadataBase: new URL("https://oncampus.in"),
  title: {
    default: "OnCampus - Admission CRM for Coaching Institutes",
    template: "%s | OnCampus",
  },
  description:
    "OnCampus helps coaching institutes capture enquiries, manage admissions, track students, courses and fees.",
  keywords: [
    "admission crm",
    "coaching institute crm",
    "student management software",
    "admission management system",
    "student admission software",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://oncampus.in",
    siteName: "OnCampus",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnCampus Admission CRM",
    description: "Admission and student management platform for coaching institutes.",
    images: ["/og-image.png"],
  },
};

// ensureInitialUser();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <body>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ReduxProvider>
              <NextTopLoader
                showSpinner={false}
                color="#00BF63"
                shadow={false}
              />
              {children}
              <Toaster
                duration={3000}
                position={"top-center"}
                richColors
                expand={false}
              />
            </ReduxProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>

    </html>
  );
}

