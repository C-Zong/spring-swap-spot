export function extractPreview(
  contentJson: string | null | undefined,
  maxLen = 40
): string {
  if (!contentJson) return "";

  try {
    const doc = JSON.parse(contentJson);

    let text = "";

    const walk = (node: any) => {
      if (!node || text.length >= maxLen) return;

      if (node.type === "text" && typeof node.text === "string") {
        text += node.text;
      }

      if (Array.isArray(node.content)) {
        for (const c of node.content) {
          if (text.length >= maxLen) break;
          walk(c);
        }
      }
    };

    walk(doc);

    text = text.replace(/\s+/g, " ").trim();

    if (text.length > maxLen) {
      text = text.slice(0, maxLen) + "…";
    }

    return text;
  } catch {
    return "";
  }
}
