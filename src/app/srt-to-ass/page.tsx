import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import SrtTool from "@/components/SrtTool";

export const metadata: Metadata = {
  title: "SRT to ASS Converter — Free Online",
  description:
    "Convert SRT subtitles to ASS (Advanced SubStation Alpha) format. Free online converter for advanced subtitle formatting.",
};

export default function Page() {
  return (
    <StaticPage>
      <SrtTool
        mode="ass"
        title="SRT to ASS Converter"
        description="Convert SRT subtitle files to ASS (Advanced SubStation Alpha) format for advanced subtitle styling and positioning."
      />
    </StaticPage>
  );
}
