import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/config";

// Edge runtime avoids the static-prerender step that fails on Windows paths with spaces.
export const runtime = "edge";

export const alt = "A birthday surprise is waiting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generic on purpose: the link preview hints at a surprise without spoiling it.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: "#2A1838",
          color: "#FFF6EC",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginBottom: 40 }}>
          {["#F6C453", "#F7A8C4", "#8FE3C9"].map((c, i) => (
            <div key={c} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 26, height: 40, borderRadius: "50% 50% 45% 45%", background: "#F6C453", marginBottom: 6 }} />
              <div style={{ width: 30, height: 120 + i * 30, borderRadius: 8, background: c }} />
            </div>
          ))}
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Someone made you a birthday surprise</div>
        <div style={{ fontSize: 34, marginTop: 24, color: "#F7A8C4" }}>{`Tap to open it on ${BRAND.name}`}</div>
      </div>
    ),
    size,
  );
}
