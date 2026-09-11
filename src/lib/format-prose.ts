/**
 * Разбивает прозу на абзацы для отображения.
 * Слова не меняет — только группирует предложения.
 */
export function splitProseParagraphs(
  text: string,
  sentencesPerParagraph = 2
): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  if (/\n\s*\n/.test(trimmed)) {
    return trimmed
      .split(/\n\s*\n/)
      .map((part) => part.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean);
  }

  const sentences = trimmed
    .split(/(?<=[.!?…])\s+(?=[«"„(А-ЯA-ZЁ])/u)
    .map((part) => part.trim())
    .filter(Boolean);

  if (sentences.length <= 1) return [trimmed];

  const per =
    sentences.length >= 10
      ? 2
      : sentences.length >= 6
        ? 2
        : Math.min(sentencesPerParagraph, sentences.length);

  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += per) {
    paragraphs.push(sentences.slice(i, i + per).join(" "));
  }
  return paragraphs;
}
