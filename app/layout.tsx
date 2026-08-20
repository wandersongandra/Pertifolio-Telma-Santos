import type { Metadata } from "next";
import Image from "next/image";
import { Fraunces, Manrope } from "next/font/google";
import { siteData } from "@/content/site-data";
import { logo } from "@/lib/photos";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { BackToTop } from "@/components/motion/BackToTop";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${siteData.meta.name} — ${siteData.meta.role}`,
  description: siteData.meta.description,
  openGraph: {
    title: `${siteData.meta.name} — ${siteData.meta.role}`,
    description: siteData.meta.description,
    type: "website",
    locale: "pt_BR",
    images: ["/telma/portraits/telma-hero-vignette.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteData.meta.name} — ${siteData.meta.role}`,
    description: siteData.meta.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-ivory">
        <SmoothScroll>
          <ScrollProgress />
          <div aria-hidden="true" className="grain-overlay" />
          <div aria-hidden="true" className="preloader">
            <Image
              src={logo.mark.src}
              alt=""
              width={64}
              height={Math.round((64 * logo.mark.height) / logo.mark.width)}
              className="preloader-mark"
              priority
            />
          </div>
          <a href="#main-content" className="skip-link">
            Pular para o conteúdo principal
          </a>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
        </SmoothScroll>
      </body>
    </html>
  );
}
