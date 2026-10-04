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
              fontSize: 58,
              lineHeight: 1.2,
              fontWeight: 700,
              maxWidth: 980,
            }}
          >
            Hometown Tax Deduction Limit Simulator
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#d7dce8", lineHeight: 1.5 }}>
            Estimate Japan furusato nozei limits from your pay slip
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
