export interface CaseStudySection {
  id: string;
  title: string;
  bodyHtml: string;
  index: number;
  kind: "default" | "solutions" | "impact";
}

export interface CaseStudySectionTocItem {
  id: string;
  title: string;
  index: number;
}

const HEADING_PATTERN =
  /<h2 id="([^"]+)">([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2 id="[^"]+">|$)/g;

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function extractCaseStudySections(source: string): CaseStudySection[] {
  const sections: CaseStudySection[] = [];

  for (const match of source.matchAll(HEADING_PATTERN)) {
    const id = match[1]?.trim();
    const title = stripHtml(match[2] ?? "");
    const bodyHtml = (match[3] ?? "").trim();

    if (!id || !title || !bodyHtml) {
      continue;
    }

    sections.push({
      id,
      title,
      bodyHtml,
      index: sections.length + 1,
      kind: getCaseStudySectionKind(id),
    });
  }

  return sections;
}

export function getCaseStudySectionTocItems(
  sections: CaseStudySection[],
): CaseStudySectionTocItem[] {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    index: section.index,
  }));
}

function getCaseStudySectionKind(id: string): CaseStudySection["kind"] {
  if (id === "solutions" || id === "解决方案") {
    return "solutions";
  }

  if (id === "impact" || id === "结果与影响") {
    return "impact";
  }

  return "default";
}
