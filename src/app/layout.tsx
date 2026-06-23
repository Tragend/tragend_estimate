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

export const metadata: Metadata = {
  title: "Tragend | AI受託開発 - 見積もりシミュレーター",
  description:
    "株式会社Tragendの公式サイト。AIを開発に組み込み、品質を落とさずコストを下げる。AI受託開発のお見積もりが1分で。",
  keywords: ["AI開発", "受託開発", "見積もり", "シミュレーター", "Tragend"],
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
        {children}
      </body>
    </html>
  );
}
