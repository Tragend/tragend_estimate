import { describe, it, expect } from "vitest";
import { yen } from "./pricing";

// 料金方針に依存しない安定スモークテスト。
// ※ 金額計算（priceEstimate 等）のテストは人間ゲート①で料金確定後に追加する。
//   （未確定の数値を先に固定すると確定時に書き直しになるため。docs/loop/BACKLOG.md 参照）
describe("yen() 表示整形", () => {
  it("3桁区切りで ¥ を付ける", () => {
    expect(yen(935000)).toBe("¥935,000");
  });

  it("0 を扱える", () => {
    expect(yen(0)).toBe("¥0");
  });

  it("百万超も区切る", () => {
    expect(yen(1234567)).toBe("¥1,234,567");
  });
});
