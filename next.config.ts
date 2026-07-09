import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDF生成の Chromium/Puppeteer はバンドルせず外部パッケージ扱いにする。
  // これをしないと @sparticuz/chromium のバイナリ解決が壊れ、サーバレスで起動に失敗する。
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};

export default nextConfig;
