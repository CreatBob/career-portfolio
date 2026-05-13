import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Noto_Sans_SC,
  Sora,
} from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { ThemeProvider } from "next-themes";

import { AmbientBackground } from "@/components/blocks/ambient-background";
import Footer from "@/components/blocks/footer";
import Navbar from "@/components/blocks/navbar/navbar";
import { ScrollRestore } from "@/components/blocks/scroll-restore";
import JsonLdScripts from "@/components/jsonld-scripts";
import {
  BaiduSiteVerification,
  GoogleTagManager,
} from "@/components/third-party";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DEFAULT_LOCALE, routing } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";

const bodyFont = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bodyCjkFont = Noto_Sans_SC({
  variable: "--font-body-cjk",
  display: "swap",
  preload: false,
  weight: ["400", "500", "700"],
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
  weight: ["400", "500", "600"],
});

/* Metadata */
type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return constructMetadata({
    description: t("headline"),
    locale: locale as Locale,
    path: `/`,
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale - if invalid, trigger 404
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale || DEFAULT_LOCALE} suppressHydrationWarning>
      <head>
        <BaiduSiteVerification />
        <JsonLdScripts locale={locale} />
      </head>

      <body
        className={`${bodyFont.variable} ${bodyCjkFont.variable} ${monoFont.variable} bg-background min-h-screen font-sans antialiased`}
      >
        {/* Main Layout */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider delayDuration={0}>
              <AmbientBackground />
              <div className="site-shell relative z-10">
                <ScrollRestore />
                <Navbar />
                {children}
                <Footer />
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>

        {/* Third-party services */}
        {process.env.NODE_ENV === "development" ? null : (
          <>
            <GoogleTagManager />
            {process.env.VERCEL_ENV ? (
              <>
                <Analytics />
                <SpeedInsights />
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </body>
    </html>
  );
}
