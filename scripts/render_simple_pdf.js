const fs = require("fs");
const path = require("path");

const inPath = process.argv[2];
const outPath = process.argv[3];
if (!inPath || !outPath) {
  console.error("Uso: node scripts/render_simple_pdf.js <input.md> <output.pdf>");
  process.exit(1);
}

function toPlain(md) {
  return md
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/^\s{0,3}#{1,6}\s+/g, ""))
    .map((l) => l.replace(/^\s*-\s+/g, "• "))
    .map((l) => l.replace(/\*\*(.*?)\*\*/g, "$1"))
    .map((l) => l.replace(/`([^`]+)`/g, "$1"))
    .map((l) => l.replace(/[📋💼📁👥⚙️💾🏅⚡💡🔍☀️🔔🪄🗑️🗂️🖨️📊]/g, ""))
    .map((l) => l.replace(/[→]/g, "->"))
    .map((l) => l.replace(/[—–]/g, "-"))
    .join("\n");
}

function sanitizeLatin1(s) {
  return s.replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "");
}

function wrapLine(line, maxChars) {
  const out = [];
  let s = line;
  while (s.length > maxChars) {
    let cut = s.lastIndexOf(" ", maxChars);
    if (cut < Math.floor(maxChars * 0.5)) cut = maxChars;
    out.push(s.slice(0, cut).trimEnd());
    s = s.slice(cut).trimStart();
  }
  out.push(s);
  return out;
}

function escapePdfText(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(lines) {
  const fontSize = 10;
  const leading = 12;
  const marginLeft = 48;
  const startY = 800;
  const maxChars = 95;
  const pageHeight = 842;
  const bottomY = 60;

  const wrapped = [];
  for (const l of lines) {
    if (l.trim() === "") {
      wrapped.push("");
      continue;
    }
    for (const w of wrapLine(l, maxChars)) wrapped.push(w);
  }

  const pages = [];
  let current = [];
  let y = startY;
  for (const l of wrapped) {
    if (y <= bottomY) {
      pages.push(current);
      current = [];
      y = startY;
    }
    current.push(l);
    y -= leading;
  }
  if (current.length) pages.push(current);

  const objects = [];
  function addObj(str) {
    objects.push(str);
    return objects.length;
  }

  const catalogId = addObj("<< /Type /Catalog /Pages 2 0 R >>");
  const kids = [];

  addObj("<< /Type /Pages /Kids [] /Count 0 >>");

  const fontId = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  for (let pi = 0; pi < pages.length; pi++) {
    const pageNo = pi + 1;
    const pageId = objects.length + 1;
    const contentId = objects.length + 2;
    kids.push(`${pageId} 0 R`);

    const contentLines = [];
    contentLines.push("BT");
    contentLines.push(`/F1 ${fontSize} Tf`);
    contentLines.push(`1 0 0 1 ${marginLeft} ${startY} Tm`);
    contentLines.push(`${leading} TL`);
    for (const l of pages[pi]) {
      const txt = escapePdfText(sanitizeLatin1(l));
      contentLines.push(`(${txt}) Tj`);
      contentLines.push("T*");
    }
    contentLines.push("ET");

    const contentStream = contentLines.join("\n");
    addObj(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`
    );
    addObj(`<< /Length ${Buffer.byteLength(contentStream, "latin1")} >>\nstream\n${contentStream}\nendstream`);
  }

  objects[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${kids.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    const off = String(offsets[i]).padStart(10, "0");
    pdf += `${off} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

const md = fs.readFileSync(inPath, "utf8");
const plain = toPlain(md);
const lines = plain.split("\n");
const buf = buildPdf(lines);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buf);
