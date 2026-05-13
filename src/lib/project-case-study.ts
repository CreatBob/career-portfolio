export interface CaseStudySection {
  id: string;
  title: string;
  bodyHtml: string;
  index: number;
}

export interface ProjectEvidenceCardConfig {
  resultTags: string[];
  figureTitle: string;
  figureCaption: string;
  figurePoints: string[];
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
    });
  }

  return sections;
}

const EVIDENCE_CARD_MAP: Record<string, ProjectEvidenceCardConfig> = {
  "jbang-ai-knowledge-base": {
    resultTags: ["Knowledge flow", "Async pipeline", "Observability"],
    figureTitle: "From upload to retrieval-ready knowledge",
    figureCaption:
      "This section proves the project is more than document storage. It shows the operational path from upload to ingestion visibility.",
    figurePoints: [
      "Category and record management keep educational files structured.",
      "Async ingestion handles extraction, chunking, and vector preparation without blocking uploads.",
      "SSE progress updates make long-running knowledge processing visible to operations teams.",
    ],
  },
  "sticker-commerce-ai-ops-toolkit": {
    resultTags: ["Workflow integration", "Quality control", "Delivery loop"],
    figureTitle: "A commerce workflow stitched into one operating loop",
    figureCaption:
      "This section proves the work connected storefront, AI tooling, OCR checks, payments, and delivery infrastructure instead of treating them as isolated modules.",
    figurePoints: [
      "Multi-tenant order and asset handling keep customer and operator workflows aligned.",
      "OCR checks add a reusable quality gate before production assets move downstream.",
      "Payments, SEO, and Cloudflare delivery keep the business loop reachable, transactable, and maintainable.",
    ],
  },
  "sticker-production-automation-tool": {
    resultTags: ["Efficiency", "Standardization", "One-click workflow"],
    figureTitle: "Manual prep condensed into a repeatable desktop workflow",
    figureCaption:
      "This section proves the project reduced invisible production friction by turning repeated file-prep work into a guided internal tool.",
    figurePoints: [
      "Operators import source artwork instead of repeating low-level setup by hand.",
      "The tool applies a consistent preparation sequence for print-ready and contour-cut outputs.",
      "Production can move forward with fewer manual adjustments and more repeatable files.",
    ],
  },
};

export function getProjectEvidenceCardConfig(
  slug: string,
): ProjectEvidenceCardConfig {
  return (
    EVIDENCE_CARD_MAP[slug] ?? {
      resultTags: ["Structured delivery", "Business value", "Technical depth"],
      figureTitle: "A project organized for fast review",
      figureCaption:
        "This section proves the project moved beyond isolated features and into a clearer delivery story.",
      figurePoints: [
        "The project is summarized through responsibilities, constraints, solutions, and outcomes.",
        "The page prioritizes business-facing impact before deeper technical reading.",
        "The same case-study contract applies across projects for easier comparison.",
      ],
    }
  );
}
