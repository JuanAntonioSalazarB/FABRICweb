import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import Script from 'next/script';
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fabriconsulting.com.mx"),
  title: {
    default: "FABRIC · Oracle Critical Engineering",
    template: "%s | FABRIC"
  },
  description: "FABRIC - Oracle Critical Engineering. Boutique de ingeniería premium especializada en la implementación, remediación y estabilización de Oracle Fusion Cloud en LATAM.",
  keywords: [
    "Oracle", "Oracle Fusion", "Oracle Fusion Cloud", "Oracle Cloud ERP",
    "Remediación Oracle", "Consultoría Oracle", "Estabilización ERP",
    "Julio Alvarez", "Ingeniería de Software", "FABRIC", "Critical Engineering"
  ],
  authors: [{ name: "Julio Alvarez" }, { name: "FABRIC Team" }],
  creator: "FABRIC",
  publisher: "FABRIC",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://fabriconsulting.com.mx",
    title: "FABRIC · Oracle Critical Engineering",
    description: "Boutique de ingeniería premium especializada en la implementación, remediación y estabilización de Oracle Fusion Cloud en LATAM.",
    siteName: "FABRIC",
    images: [
      {
        url: "/img/logo.png",
        width: 800,
        height: 600,
        alt: "FABRIC Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FABRIC · Oracle Critical Engineering",
    description: "Boutique de ingeniería premium especializada en la implementación, remediación y estabilización de Oracle Fusion Cloud en LATAM.",
    images: ["/img/logo.png"],
  },
  alternates: {
    canonical: "https://fabriconsulting.com.mx",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="es"
        className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} h-full antialiased`}
      >
        <head>
          {/* Initialize Google Translate */}
          <Script id="google-translate-init" strategy="beforeInteractive">
            {`
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'es',
                  includedLanguages: 'es,en',
                  layout: typeof window !== 'undefined' && window.google ? google.translate.TranslateElement.InlineLayout.SIMPLE : 0,
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `}
          </Script>
          <Script 
            src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
            strategy="afterInteractive" 
          />
        </head>
        <body className="min-h-full flex flex-col bg-black text-white selection:bg-accent selection:text-black">
          {/* Hidden Google Translate container */}
          <div id="google_translate_element" style={{ display: 'none' }}></div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
