import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Header,
  Footer,
  AlignmentType,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";
import type { TranscriptSegment } from "./youtube";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function toSrtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const ms = Math.floor((s - Math.floor(s)) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(Math.floor(s)).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

export interface ExportMeta {
  videoId: string;
  title?: string;
  channel?: string;
}

function buildHeader(videoId: string, title?: string, channel?: string): string {
  const lines: string[] = [];
  lines.push("=".repeat(60));
  if (title) lines.push(`Video: ${title}`);
  if (channel) lines.push(`Channel: ${channel}`);
  lines.push(`Video ID: ${videoId}`);
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push(`Total Segments: ${"PLACEHOLDER"}`);
  lines.push("=".repeat(60));
  lines.push("");
  return lines.join("\n");
}

// ── TXT ────────────────────────────────────────────

export function exportTxt(
  segments: TranscriptSegment[],
  videoId: string,
  meta?: ExportMeta
) {
  const header = buildHeader(videoId, meta?.title, meta?.channel).replace(
    "PLACEHOLDER",
    String(segments.length)
  );
  const content =
    header +
    segments
      .map((s) => `[${formatTime(s.offset)}]\n${s.text}`)
      .join("\n\n");
  downloadBlob(content, "text/plain", `transcript-${videoId}.txt`);
}

// ── SRT ────────────────────────────────────────────

export function exportSrt(
  segments: TranscriptSegment[],
  videoId: string
) {
  const content = segments
    .map((s, i) => {
      const end = s.offset + s.duration;
      return `${i + 1}\n${toSrtTime(s.offset)} --> ${toSrtTime(end)}\n${s.text}`;
    })
    .join("\n\n");
  downloadBlob(content, "text/plain", `transcript-${videoId}.srt`);
}

// ── VTT ────────────────────────────────────────────

export function exportVtt(
  segments: TranscriptSegment[],
  videoId: string,
  meta?: ExportMeta
) {
  let content = "WEBVTT\n";
  if (meta?.title) {
    content += `\nNOTE ${meta.title}`;
    if (meta.channel) content += ` — ${meta.channel}`;
    content += "\n";
  }
  content +=
    "\n" +
    segments
      .map((s) => {
        const end = s.offset + s.duration;
        return `${toSrtTime(s.offset)} --> ${toSrtTime(end)}\n${s.text}`;
      })
      .join("\n\n");
  downloadBlob(content, "text/vtt", `transcript-${videoId}.vtt`);
}

// ── PDF ────────────────────────────────────────────

export function exportPdf(
  segments: TranscriptSegment[],
  videoId: string,
  meta?: ExportMeta
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 22;
  const maxWidth = pageWidth - margin * 2;

  // ── Header section ──
  let y = 22;

  // Title
  const title = meta?.title || `YouTube Transcript — ${videoId}`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 4;

  // Meta line
  const metaParts: string[] = [];
  if (meta?.channel) metaParts.push(meta.channel);
  metaParts.push(`${segments.length} segments`);
  metaParts.push(new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }));

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(metaParts.join("  ·  "), margin, y);
  y += 8;

  // Divider line
  doc.setDrawColor(220);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ── Segments ──
  segments.forEach((seg, i) => {
    const timeStr = formatTime(seg.offset);

    // Page break check
    if (y > pageHeight - 35) {
      doc.addPage();
      y = 22;
    }

    // Segment number + timestamp
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(79, 70, 229); // primary indigo
    doc.text(`${String(i + 1).padStart(3, "0")}  ${timeStr}`, margin, y);
    y += 5;

    // Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40);

    const lines = doc.splitTextToSize(seg.text, maxWidth);
    lines.forEach((line: string) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 22;
      }
      doc.text(line, margin, y);
      y += 4.5;
    });

    y += 2.5; // gap between segments
  });

  // ── Footer on all pages ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(170);
    const footerText = `YouTube Transcripts — ${videoId}  |  Page ${i} of ${totalPages}`;
    doc.text(footerText, margin, pageHeight - 12);
  }

  const safeTitle = meta?.title
    ? meta.title.slice(0, 50).replace(/[^a-zA-Z0-9 ]/g, "")
    : videoId;
  doc.save(`transcript-${safeTitle || videoId}.pdf`);
}

// ── DOCX ────────────────────────────────────────────

export async function exportDocx(
  segments: TranscriptSegment[],
  videoId: string,
  meta?: ExportMeta
) {
  const children: Paragraph[] = [];

  // Title
  const title = meta?.title || `YouTube Transcript — ${videoId}`;
  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 120 },
    })
  );

  // Meta
  const metaParts: string[] = [];
  if (meta?.channel) metaParts.push(`Channel: ${meta.channel}`);
  metaParts.push(`${segments.length} segments`);
  metaParts.push(
    `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
  );

  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: metaParts.join("  ·  "),
          size: 18,
          color: "888888",
          font: "Arial",
        }),
      ],
    })
  );

  // Thin divider
  children.push(
    new Paragraph({
      spacing: { after: 300 },
      border: {
        bottom: { style: "single", color: "CCCCCC", size: 1, space: 8 },
      },
      children: [],
    })
  );

  // Segments
  segments.forEach((seg, i) => {
    const timeStr = formatTime(seg.offset);

    children.push(
      new Paragraph({
        spacing: { before: 200 },
        children: [
          new TextRun({
            text: `${String(i + 1).padStart(3, "0")}  ${timeStr}`,
            bold: true,
            color: "4F46E5",
            size: 16,
            font: "Arial",
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: seg.text,
            size: 21,
            font: "Arial",
          }),
        ],
      })
    );
  });

  const doc = new Document({
    title: title,
    description: `YouTube transcript for ${videoId}`,
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 21,
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                text: `YouTube Transcripts — ${meta?.title || videoId}`,
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                text: "Generated by YouTube Transcripts",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = meta?.title
    ? meta.title.slice(0, 50).replace(/[^a-zA-Z0-9 ]/g, "")
    : videoId;
  saveAs(blob, `transcript-${safeTitle || videoId}.docx`);
}

function downloadBlob(
  content: string,
  mime: string,
  filename: string
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
