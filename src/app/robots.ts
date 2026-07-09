import type { MetadataRoute } from "next";

const SITE_URL = "https://estimate.tragend.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // リード個別の成果物ルートはインデックスさせない
      disallow: ["/download/", "/print/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
