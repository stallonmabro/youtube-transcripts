import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import SrtTool from "@/components/SrtTool";

export const metadata: Metadata = {
  title: "Open SRT File Online",
  description:
    "Open and view SRT subtitle files online. Free SRT file viewer that displays subtitles with timestamps in a clean readable format.",
};

export default function Page() {
  return (
    <StaticPage>
      <SrtTool
        mode="view"
        title="Open SRT File Online"
        description="View SRT subtitle files directly in your browser. Paste SRT content or upload a file to see subtitles with timestamps in a clean, readable format."
      />
    </StaticPage>
  );
}
