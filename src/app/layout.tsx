import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
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
  metadataBase: new URL("https://fabricsoft.com.mx"),
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
    url: "https://fabricsoft.com.mx",
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
    canonical: "https://fabricsoft.com.mx",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-accent selection:text-black">
        {/* Moment 0 Preloader */}
        <div id="global-preloader" style={{ position: 'fixed', inset: '0', background: '#0A0A0A', zIndex: '99999', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.4s ease', pointerEvents: 'all' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid rgba(201, 169, 110, 0.1)', borderTop: '2px solid #C9A96E', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#C9A96E', textTransform: 'uppercase', animation: 'pulse-opacity-preloader 1.5s ease-in-out infinite' }}>FABRIC</div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes pulse-opacity-preloader { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
          `}} />
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            function removeLoader() {
              var loader = document.getElementById('global-preloader');
              if (loader) {
                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';
                setTimeout(function() {
                  if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                  }
                }, 400);
              }
            }
            window.addEventListener('load', removeLoader);
            // Fallback if load event already fired
            if (document.readyState === 'complete') {
              removeLoader();
            }

            // Register Service Worker for repeat visit speed
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function(err) {
                  console.warn('SW registration failed:', err);
                });
              });
            }
          })();
        `}} />

        {children}
      </body>
    </html>
  );
}
