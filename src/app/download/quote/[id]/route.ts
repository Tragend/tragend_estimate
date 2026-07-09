// 見積書PDFのダウンロード。連絡先が保存済みの行のみ許可（ゲート＆IDOR緩和）。
import type { NextRequest } from "next/server";
import { getQuoteDocData } from "@/lib/estimate/fetch";
import { renderUrlToPdf } from "@/lib/pdf/render";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // PDF生成は重い（サーバレスのタイムアウト対策）

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await getQuoteDocData(id);
  if (!data) return new Response("Not found", { status: 404 });
  if (!data.hasContact) return new Response("Forbidden", { status: 403 });

  try {
    const pdf = await renderUrlToPdf(`${req.nextUrl.origin}/print/quote/${id}`);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent("見積書.pdf")}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[download/quote] PDF生成失敗:", e instanceof Error ? e.message : e);
    return new Response("PDFの生成に失敗しました。時間をおいて再度お試しください。", {
      status: 500,
    });
  }
}
