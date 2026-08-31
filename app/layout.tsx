import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { Fraunces, Manrope } from "next/font/google";
import { siteData } from "@/content/site-data";
import { siteUrl } from "@/lib/site-url";
import { logo } from "@/lib/photos";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { BackToTop } from "@/components/motion/BackToTop";
import { StructuredData } from "@/components/seo/StructuredData";
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

/*
  Sem esta exportacao o Next emite apenas `width=device-width, initial-scale=1`,
  e sem `viewport-fit=cover` toda funcao `env(safe-area-inset-*)` do projeto
  resolve para 0 — inclusive as do cabecalho, do menu e do botao de voltar ao
  topo, que existiam justamente para desviar do entalhe e da barra de gestos do
  iPhone. Com `cover` a pagina passa a ocupar a tela inteira e as goteiras
  (`.shell` em globals.css) reservam a area segura de verdade.

  `maximumScale` e `userScalable` ficam de fora de proposito: limitar o zoom
  quebra WCAG 1.4.4.
*/
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: siteData.meta.seoTitle,
  description: siteData.meta.description,
  openGraph: {
    title: `${siteData.meta.name} — ${siteData.meta.role}`,
    description: siteData.meta.description,
    // Sem `url` o Next não emite `og:url`, e o raspador de link passa a inferir
    // o endereço a partir de onde foi compartilhado — inclusive com parâmetros
    // de rastreamento colados no fim.
    url: "/",
    type: "website",
    locale: "pt_BR",
    // JPEG, não o WebP que o site usa: o suporte a WebP nos raspadores de link
    // é irregular, no LinkedIn em especial, e aqui é uma imagem só.
    images: ["/telma/portraits/telma-hero-vignette.jpg"],
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
        <StructuredData />
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
