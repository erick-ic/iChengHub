export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function generateHeadingId(text: string, idCount: Record<string, number>): string {
  let baseId = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  if (idCount[baseId]) {
    idCount[baseId]++;
    baseId = `${baseId}-${idCount[baseId]}`;
  } else {
    idCount[baseId] = 1;
  }

  return baseId;
}

export function extractHeadings(content: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const idCount: Record<string, number> = {};

  if (content.includes('<h2') || content.includes('<h3')) {
    const htmlHeadingRegex = /<h([23])\s*(?:id="[^"]*")?\s*>(.+?)<\/h[23]>/gi;
    let match;
    while ((match = htmlHeadingRegex.exec(content)) !== null) {
      const level = parseInt(match[1], 10);
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      const id = generateHeadingId(text, idCount);
      headings.push({ id, text, level });
    }
  } else {
    const markdownHeadingRegex = /^(#{2,3})\s+(.+)$/gm;
    let match;
    while ((match = markdownHeadingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateHeadingId(text, idCount);
      headings.push({ id, text, level });
    }
  }

  return headings;
}
