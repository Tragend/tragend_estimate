import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chromium は実行時にリモート pack から取得するためバイナリ同梱は不要。
  // Puppeteer/chromium-min はバンドルせず外部パッケージ扱いにする。
  serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],
};

export default nextConfig;
