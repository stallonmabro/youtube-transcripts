import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import SrtTool from "@/components/SrtTool";

export const metadata: Metadata = {
  title: "SRT to VTT Converter — Free Online",
  description:
    "Convert SRT subtitle files to VTT format online for free. Easy SRT to WebVTT converter for HTML5 video players.",
};

export default function Page() {
  return (
    <StaticPage>
      <SrtTool
        mode="vtt"
        title="SRT to VTT Converter"
        description="Convert SRT subtitle files to WebVTT (VTT) format for use in HTML5 video players. Fast, secure, and works entirely in your browser."
      />
    </StaticPage>
  );
}
