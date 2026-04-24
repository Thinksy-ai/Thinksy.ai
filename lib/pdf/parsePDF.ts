import * as pdfjsLib from "pdfjs-dist";

export async function parsePDF(file: File) {
  const data = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const strings = content.items.map((item: any) => item.str);
    text += strings.join(" ") + "\n";
  }

  return text;
}
