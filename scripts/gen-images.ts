import { config } from "dotenv";
config({ path: ".env.local", quiet: true });
import { writeFileSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error("NO GEMINI_API_KEY"); process.exit(1); }

const MODEL = "imagen-4.0-generate-001";
const STYLE =
  "flat modern vector illustration, clean and minimal, soft blue (#2563EB) and white color palette, professional corporate tech aesthetic, plain white background, centered composition, no text, no letters, no words, no logo";

const specs = [
  { file: "domain-leisure.png", aspect: "4:3", prompt: `Event reservation web app for a leisure facility: a smartphone showing a calendar with selectable time slots and a QR-code ticket, subtle ferris wheel in the background. ${STYLE}` },
  { file: "domain-attendance.png", aspect: "4:3", prompt: `Employee attendance management dashboard on a laptop screen: a time-clock punch button, approval checkmarks, and a monthly summary bar chart. ${STYLE}` },
  { file: "domain-drawing.png", aspect: "4:3", prompt: `Engineering blueprint and drawing management system: neatly stacked technical blueprint documents with version tags and a search magnifier, a small gear motif for manufacturing. ${STYLE}` },
  { file: "domain-ec.png", aspect: "4:3", prompt: `E-commerce and inventory management: an online storefront window with products and a shopping cart, plus warehouse boxes with stock-level indicator bars. ${STYLE}` },
];

async function main() {
  for (const s of specs) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: s.prompt }],
          parameters: { sampleCount: 1, aspectRatio: s.aspect },
        }),
      }
    );
    const json: any = await res.json();
    if (!res.ok) { console.error(s.file, "HTTP", res.status, JSON.stringify(json).slice(0, 250)); continue; }
    const b64 = json?.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) { console.error(s.file, "no image:", JSON.stringify(json).slice(0, 250)); continue; }
    const buf = Buffer.from(b64, "base64");
    writeFileSync(`public/${s.file}`, buf);
    console.log(s.file, "OK", (buf.length / 1024).toFixed(0) + "KB");
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
