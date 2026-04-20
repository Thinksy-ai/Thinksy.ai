export function generateTitle(text: string): string {
  const cleaned = text.trim();

  const words = cleaned.split(" ").slice(0, 6);
  let title = words.join(" ");

  title = title.replace(/[^\w\s]/gi, "");
  title = title.charAt(0).toUpperCase() + title.slice(1);

  return title || "New Chat";
}
