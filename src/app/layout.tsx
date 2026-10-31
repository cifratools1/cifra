import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cifra — Herramientas técnicas gratuitas y seguras",
    template: "%s | Cifra",
  },
  description:
    "Calculadoras de subredes, conversores, generadores de contraseñas y más. Herramientas 100% gratuitas que funcionan directamente en tu navegador sin enviar datos a ningún servidor.",
  metadataBase: new URL("https://cifra.tools"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Cifra",
    title: "Cifra — Herramientas técnicas gratuitas y seguras",
    description:
      "Calculadoras de subredes, conversores, generadores y más. 100% en tu navegador.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Cifra — Herramientas y calculadoras para el día a día",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cifra — Herramientas técnicas gratuitas y seguras",
    description:
      "Calculadoras de subredes, conversores, generadores y más. 100% en tu navegador.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.svg", type: "image/svg+xml" },
    ],
    apple: "/icon-192.svg",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var stored = localStorage.getItem('cifra-theme') || localStorage.getItem('cifra_theme');
                if (stored === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })();`,
          }}
        />
        {/*
          Google AdSense — DESACTIVADO hasta configurar cuenta real.
          Para activar: descomenta la línea siguiente y reemplaza ca-pub-XXXXXXXXXX
          con tu ID de editor de AdSense real.
          
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
            crossOrigin="anonymous"
          />
        */}
        {/*
          Google Analytics / Google Tag Manager — DESACTIVADO hasta configurar.
          Para activar: reemplaza G-XXXXXXXXXX con tu ID de GA4.
          Asegúrate de tener el consentimiento de cookies configurado antes.
          
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
          <script dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });`
          }} />
        */}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
