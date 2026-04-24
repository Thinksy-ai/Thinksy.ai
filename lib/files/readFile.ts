export async function readFile(file: File): Promise<string> {
  if (file.type.includes("text")) {
    return await file.text();
  }

  // fallback for unsupported
  return `[File uploaded: ${file.name}]`;
}
