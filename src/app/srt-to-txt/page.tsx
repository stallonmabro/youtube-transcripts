import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import SrtTool from "@/components/SrtTool";

export const metadata: Metadata = {
  title: "SRT to TXT Converter — Free Online",
  description:
    "Convert SRT subtitle files to plain text. Remove timestamps and keep only the subtitle text. Free online SRT to TXT converter.",
};

export default function Page() {
  return (
    <StaticPage>
      <SrtTool
        mode="txt"
        title="SRT to TXT Converter"
        description="Convert SRT subtitle files to plain text. Strips timestamps and subtitle numbers, leaving clean readable text for notes or further processing."
      />
    </StaticPage>
  );
}
