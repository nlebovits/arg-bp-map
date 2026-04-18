import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Barrios Visibles - Mapa de asentamientos informales en Argentina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const titles: Record<string, string> = {
  es: "Barrios Visibles",
  en: "Visible Neighborhoods",
};

const subtitles: Record<string, string> = {
  es: "Mapa de asentamientos informales en Argentina",
  en: "Informal settlements map of Argentina",
};

export default async function Image({ params }: { params: { locale: string } }) {
  const locale = params.locale || "es";
  const title = titles[locale] || titles.es;
  const subtitle = subtitles[locale] || subtitles.es;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)",
        }}
      >
        {/* Argentina silhouette hint */}
        <div
          style={{
            position: "absolute",
            right: 80,
            top: "50%",
            transform: "translateY(-50%)",
            width: 200,
            height: 400,
            background: "linear-gradient(180deg, #f59e0b33 0%, #f59e0b11 100%)",
            borderRadius: "100px 100px 40px 40px",
            opacity: 0.5,
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: "#fafafa",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "#a1a1aa",
              marginTop: 24,
              textAlign: "center",
              maxWidth: 700,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)",
          }}
        />

        {/* Data source badges */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 14, color: "#71717a" }}>RENABAP</span>
          <span style={{ fontSize: 14, color: "#52525b" }}>+</span>
          <span style={{ fontSize: 14, color: "#71717a" }}>Satellite Building Footprints</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
