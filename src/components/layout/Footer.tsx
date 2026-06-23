import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <a
              href="https://tragend.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <img src="/logo.png" alt="Tragend" className="h-8 w-auto" />
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AIを開発に組み込み、
              <br />
              品質を落とさずコストを下げる。
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              サービス
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/estimate"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                見積もりシミュレーター
              </Link>
              <a
                href="https://tragend.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                実績を見る
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              お問い合わせ
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              プロジェクトのご相談やお見積もりは
              <br />
              お気軽にお問い合わせください。
            </p>
            <Link
              href="/estimate"
              className="inline-block bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              無料で見積もり
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} 株式会社Tragend. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              利用規約
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
