// HTML（Next の印刷用ルート）→ PDF 変換。
// ローカル(mac/win)はインストール済み Chrome を使い、本番(Vercel/Linux)は
// @sparticuz/chromium のバンドル Chromium を使う（同一コードパス）。
import puppeteer, { type Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

/** サーバーレス環境かどうか（Vercel / Lambda） */
function isServerless(): boolean {
  return !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
}

/** ローカル Chrome の実行パス（環境変数優先、無ければ OS 既定） */
function localChromePath(): string {
  if (process.env.CHROME_EXECUTABLE_PATH) return process.env.CHROME_EXECUTABLE_PATH;
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  if (process.platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }
  return "/usr/bin/google-chrome";
}

async function launchBrowser(): Promise<Browser> {
  if (isServerless()) {
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  return puppeteer.launch({
    executablePath: localChromePath(),
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
