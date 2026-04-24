import { parsePDF } from "@/lib/pdf/parsePDF";

export async function readFile(file: File): Promise<string> {
  if (file.type.includes("text")) {
    return await file.text();
  }

  if (file.type.includes("pdf")) {
    return await parsePDF(file);
  }

  return `[File uploaded: ${file.name}]`;
}
