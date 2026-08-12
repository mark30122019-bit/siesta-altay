import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "50%",
          color: "#F5EFE0",
          fontSize: 20,
          fontWeight: 600,
          fontFamily: "Georgia, serif",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
