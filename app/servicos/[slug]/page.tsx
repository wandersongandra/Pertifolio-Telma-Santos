import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceLanding } from "@/components/sections/ServiceLanding";
import { StructuredDataBlock } from "@/components/seo/StructuredData";
import {
  getAreaForService,
  getServicePage,
  servicePages,
} from "@/content/service-pages";
import { siteData } from "@/content/site-data";
import { siteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) return {};

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: `/servicos/${service.slug}`,
      type: "website",
      locale: "pt_BR",
      images: ["/telma/portraits/telma-hero-vignette.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: service.seoTitle,
      description: service.seoDescription,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) notFound();

  const area = getAreaForService(service);
  const pageUrl = `${siteUrl}/servicos/${service.slug}`;
  const personId = `${siteUrl}/#telma-santos`;

  return (
    <>
      <StructuredDataBlock
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${pageUrl}#service`,
              name: area.label,
              serviceType: area.label,
              description: service.seoDescription,
              url: pageUrl,
              areaServed: {
                "@type": "State",
                name: "Bahia",
                addressCountry: "BR",
              },
              provider: { "@id": personId },
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${pageUrl}#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Início",
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Áreas de atuação",
                  item: `${siteUrl}/#atuacao`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: area.label,
                  item: pageUrl,
                },
              ],
            },
          ],
        }}
      />
      <ServiceLanding service={service} />
    </>
  );
}
