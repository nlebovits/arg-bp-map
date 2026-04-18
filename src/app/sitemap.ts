import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://barriosvisibles.ar";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["es", "en"];
  const lastModified = new Date();

  // Generate entries for each locale
  const entries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "es" ? 1.0 : 0.9, // Spanish is primary
    alternates: {
      languages: {
        es: `${siteUrl}/es`,
        en: `${siteUrl}/en`,
      },
    },
  }));

  return entries;
}
