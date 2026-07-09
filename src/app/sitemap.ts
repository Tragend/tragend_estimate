import type { MetadataRoute } from "next";

const SITE_URL = "https://estimate.tragend.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/estimate`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
