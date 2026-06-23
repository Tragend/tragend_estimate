// PDF生成のローカル検証（dev server が3001で起動している前提）
import { renderUrlToPdf } from "../src/lib/pdf/render";
import { writeFileSync } from "node:fs";

const BASE = "http://localhost:3001";
async function main() {
  for (const doc of ["quote", "spec"]) {
    console.log(`生成中: ${doc} ...`);
    const pdf = await renderUrlToPdf(`${BASE}/print/sample/${doc}`);
    const out = `/tmp/sample-${doc}.pdf`;
    writeFileSync(out, pdf);
    console.log(`  ✅ ${out}（${(pdf.length / 1024).toFixed(1)} KB）`);
  }
}
main().catch((e) => {
  console.error("❌", e);
  process.exit(1);
});
