// 印刷用レイアウト（ヘッダー・フッターなし）。Puppeteer がこのページを開いて PDF 化する。
// 余白は書類コンポーネント側で持つため、ここでは白背景のみ。
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white">{children}</div>;
}
