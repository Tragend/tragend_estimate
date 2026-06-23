// サイト共通レイアウト（ヘッダー・フッター付き）。
// 印刷用ページ (print) はこのグループ外なので、これらの装飾は付かない。
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
