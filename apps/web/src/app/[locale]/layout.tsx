"use client";

// import AppTopClinetSetup from "@/components/global/AppTopClinetSetup";
import { colors } from "@/constants/colors";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Viewport } from "next";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { use, useEffect } from "react";
import { lora } from "../fonts/default";

export const viewport: Viewport = {
  themeColor: "#00bba7",
  colorScheme: "dark",
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: true,
  interactiveWidget: "resizes-visual",
  viewportFit: "auto",
};

export default function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = use(params);
  // const dir = new Intl.Locale(locale).getTextInfo().direction;

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service worker registered:", registration);
          })
          .catch((error) => {
            console.error("Service worker registration failed:", error);
          });
      });
    }
  }, []);

  return (
    <html
      lang={locale}
      // dir={dir}
      className="dark"
    >
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* @ts-expect-error */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        {/* preconnect s3 bucket for reduce latency */}
        <link rel="preconnect" href="https://pdfy-bucket.s3.eu-north-1.amazonaws.com" />
      </head>
      <body className={`${lora.className} bg-gr-multi-dark flex flex-col h-dvh`}>
        <NextTopLoader
          color={colors.primary[300]}
          height={1.5}
          showSpinner={false}
          crawlSpeed={100}
          template={`<div class="bar rounded-r-full" role="bar">
                <div class="peg"></div>
              </div>
              <div class="spinner" role="spinner">
                <div class="spinner-icon"></div>
              </div>`}
        />
        
        {children}

        <section id="client-notification-portal" />

        <Analytics /> {/* Vercel Analytics */}
        <SpeedInsights /> {/* Vercel Speed Insights */}

        {/* Google tag (gtag.js)  */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-TLH46P1DCD" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-TLH46P1DCD');`}
        </Script>
      </body>
    </html>
  );
}
