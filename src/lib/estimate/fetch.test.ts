import { describe, it, expect } from "vitest";
import { isContactComplete, isRenderableRequirement } from "./fetch";

// ダウンロード/印刷ゲートの要。回帰で穴が空くと他人のPDFが取れる恐れがあるため固定する。
describe("isContactComplete — DLゲート判定", () => {
  it("担当者名＋規約同意ありで true", () => {
    expect(isContactComplete({ contact_name: "山田", agreed_terms: true })).toBe(true);
  });
  it("規約未同意は false", () => {
    expect(isContactComplete({ contact_name: "山田", agreed_terms: false })).toBe(false);
  });
  it("担当者名なしは false", () => {
    expect(isContactComplete({ contact_name: "", agreed_terms: true })).toBe(false);
    expect(isContactComplete({ contact_name: null, agreed_terms: true })).toBe(false);
  });
  it("両方なしは false", () => {
    expect(isContactComplete({})).toBe(false);
  });
});

describe("isRenderableRequirement — 壊れた行を弾く", () => {
  it("features配列があれば true", () => {
    expect(isRenderableRequirement({ features: [{ name: "x" }] })).toBe(true);
  });
  it("features空・なし・非オブジェクトは false", () => {
    expect(isRenderableRequirement({ features: [] })).toBe(false);
    expect(isRenderableRequirement({})).toBe(false);
    expect(isRenderableRequirement(null)).toBe(false);
    expect(isRenderableRequirement("x")).toBe(false);
  });
});
