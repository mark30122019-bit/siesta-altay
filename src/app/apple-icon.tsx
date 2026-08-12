import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #3a5c42 0%, #35523a 100%)",
          borderRadius: 36,
          color: "#F5EFE0",
          fontSize: 108,
          fontWeight: 600,
          fontFamily: "Georgia, serif",
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
