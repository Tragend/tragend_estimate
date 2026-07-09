import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDF生成の Chromium/Puppeteer はバンドルせず外部パッケージ扱いにする。
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  // @sparticuz/chromium は実行時に bin/ の brotli バイナリを動的読込するためトレース対象外になる。
  // ダウンロードAPIのバンドルに bin/ を強制同梱する（これが無いと「bin does not exist」で500）。
  outputFileTracingIncludes: {
    "/download/quote/[id]": ["./node_modules/@sparticuz/chromium/bin/**"],
    "/download/spec/[id]": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
};

export default nextConfig;
