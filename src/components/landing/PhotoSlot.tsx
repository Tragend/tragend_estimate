// 写真の差し込み枠（ユーザーが後で画像に差し替える）。
// 使い方: <PhotoSlot label="メインビジュアル" aspect="16/9" className="..." />
export function PhotoSlot({
  label = "写真",
  aspect = "16/9",
  className = "",
}: {
  label?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 text-slate-400 ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <div className="px-2 text-center">
        <div className="text-2xl leading-none">📷</div>
        <p className="mt-1 text-[11px] font-medium leading-tight">{label}</p>
      </div>
    </div>
  );
}
