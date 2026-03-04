import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Giovanni Bagmeijer | Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #080808 0%, #0f1218 50%, #080808 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient orb */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(110,231,183,0.08) 0%, transparent 60%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px",
              background: "rgba(110,231,183,0.08)",
              border: "1px solid rgba(110,231,183,0.2)",
              borderRadius: "999px",
              padding: "6px 16px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#6ee7b7",
              }}
            />
            <span style={{ color: "#6ee7b7", fontSize: "14px", fontWeight: 600, letterSpacing: "0.1em" }}>
              OPEN TO WORK
            </span>
          </div>

          <h1
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textAlign: "center",
              margin: 0,
            }}
          >
            Giovanni Bagmeijer
          </h1>

          <p
            style={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#71717a",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              marginTop: "16px",
            }}
          >
            Full Stack Engineer
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            {["Next.js", "TypeScript", "React", "PostgreSQL", "Python"].map((t) => (
              <span
                key={t}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#a1a1aa",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#3f3f46",
            fontSize: "13px",
          }}
        >
          <span>giovanni-portfolio-eta.vercel.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
