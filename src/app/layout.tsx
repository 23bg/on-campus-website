import type { Metadata } from "next";
import "@/styles/globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/theme-provider";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

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


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages");

  return {
    title: t("landingMetaTitle"),
    description: t("landingMetaDescription"),
  };
}

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
              <main>{children}</main>
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

