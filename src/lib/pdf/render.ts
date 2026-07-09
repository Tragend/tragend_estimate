// HTML（Next の印刷用ルート）→ PDF 変換。ホスティング非依存。
//  - 本番(NODE_ENV=production／Linuxコンテナ全般: Firebase App Hosting・Cloud Run・Vercel・Lambda 等)
//    → @sparticuz/chromium のバンドル Chromium
//  - ローカル開発(mac/win) → インストール済み Chrome
//  - CHROME_EXECUTABLE_PATH があれば常に優先（任意のホストで上書き可）
import puppeteer, { type Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

/** ローカル Chrome の実行パス（OS 既定） */
function localChromePath(): string {
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  if (process.platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }
  return "/usr/bin/google-chrome";
}

async function launchBrowser(): Promise<Browser> {
  const override = process.env.CHROME_EXECUTABLE_PATH;
  // 本番かつ上書き無し → バンドル Chromium（ホスト非依存）。それ以外はローカル/上書きパス。
  if (process.env.NODE_ENV === "production" && !override) {
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  return puppeteer.launch({
    executablePath: override ?? localChromePath(),
    headless: true,
    args: ["--no-sandbox"],
  });
}

/** 指定 URL（印刷用ルート）を A4 PDF にして返す */
export async function renderUrlToPdf(url: string): Promise<Buffer> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
