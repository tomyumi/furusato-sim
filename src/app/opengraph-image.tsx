import { ImageResponse } from "next/og";
import { SEO } from "@/lib/seo";

export const alt = SEO.defaultTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(165deg, #243250 0%, #1c2740 55%, #12192b 100%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.32em",
            color: "#e0c078",
            fontWeight: 700,
          }}
        >
          FURUSATO LAB
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              lineHeight: 1.2,
              fontWeight: 700,
              maxWidth: 980,
            }}
          >
            副業・個人事業主・住宅ローン控除に対応
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              lineHeight: 1.35,
              fontWeight: 700,
              maxWidth: 980,
            }}
          >
            ふるさと納税シミュレーター
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#d7dce8", lineHeight: 1.5 }}>
            本業と副業の合算・青色申告・住宅ローン控除の振替まで限度額を計算
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
