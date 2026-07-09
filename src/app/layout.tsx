import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://estimate.tragend.com";
const OG_TITLE = "システム開発の見積もりが1分で無料｜AI受託開発 Tragend";
const OG_DESC =
  "システム開発の概算見積もりが、フォーム入力1分で無料に。AIが要件を整理し、見積書とプロジェクト構想書（叩き台）をその場でダウンロード。株式会社Tragendの受託開発見積もりシミュレーター。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: OG_TITLE,
    template: "%s｜Tragend",
  },
  description: OG_DESC,
  keywords: [
    "システム開発 見積もり",
    "受託開発 見積もり",
    "システム開発 費用",
    "見積もりシミュレーター",
    "AI開発",
    "Tragend",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "Tragend 見積もりシミュレーター",
    title: OG_TITLE,
    description: OG_DESC,
    images: [{ url: "/logo.png", alt: "Tragend" }],
  },
  twitter: {
    card: "summary",
    title: OG_TITLE,
    description: OG_DESC,
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};

// 構造化データ（組織＋提供サービス）。検索エンジンにサービス内容を明示する。
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "株式会社Tragend",
  url: "https://tragend.com",
  logo: `${SITE_URL}/logo.png`,
  description: OG_DESC,
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "システム開発の見積もりシミュレーター",
      serviceType: "受託システム開発の概算見積もり",
      areaServed: "JP",
      url: SITE_URL,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}
        style={{ fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
