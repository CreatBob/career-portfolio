type ContentImageSize = "sm" | "md" | "lg";
type ContentImageLayout = "inline" | "wide";

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

interface ContentImageOptions {
  caption?: string;
  layout: ContentImageLayout;
  showCaption: boolean;
  size: ContentImageSize;
}

const DEFAULT_IMAGE_OPTIONS: ContentImageOptions = {
  layout: "inline",
  showCaption: true,
  size: "lg",
};

const CAPTION_OFF_VALUES = new Set(["0", "false", "hidden", "no", "none", "off"]);
const IMAGE_LAYOUTS = new Set<ContentImageLayout>(["inline", "wide"]);
const IMAGE_SIZES = new Set<ContentImageSize>(["sm", "md", "lg"]);

function isElement(node: HastNode | undefined, tagName?: string): node is HastNode {
  return Boolean(
    node &&
      node.type === "element" &&
      (!tagName || node.tagName === tagName),
  );
}

function isWhitespaceTextNode(node: HastNode) {
  return node.type === "text" && typeof node.value === "string" && node.value.trim() === "";
}

function normalizeClassName(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return value.split(/\s+/).filter(Boolean);
  }

  return [];
}

function addClassNames(node: HastNode, classNames: string[]) {
  const existing = normalizeClassName(node.properties?.className);
  const merged = [...new Set([...existing, ...classNames])];

  node.properties = {
    ...node.properties,
    className: merged,
  };
}

function readStringProperty(node: HastNode, key: string) {
  const value = node.properties?.[key];
  return typeof value === "string" ? value : "";
}

function splitOptionSegments(title: string) {
  if (title.includes("|")) {
    return title
      .split("|")
      .map((segment) => segment.trim())
      .filter(Boolean);
  }

  return title
    .split(/\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function parseContentImageOptions(title: string): ContentImageOptions {
  const options: ContentImageOptions = { ...DEFAULT_IMAGE_OPTIONS };

  for (const segment of splitOptionSegments(title)) {
    const [rawKey, ...rawValueParts] = segment.split("=");
    const key = rawKey.trim().toLowerCase();
    const rawValue = rawValueParts.join("=").trim();
    const normalizedValue = rawValue.toLowerCase();

    if (!rawValue) {
      if (IMAGE_SIZES.has(key as ContentImageSize)) {
        options.size = key as ContentImageSize;
      }

      if (IMAGE_LAYOUTS.has(key as ContentImageLayout)) {
        options.layout = key as ContentImageLayout;
      }

      continue;
    }

    if (key === "size" && IMAGE_SIZES.has(normalizedValue as ContentImageSize)) {
      options.size = normalizedValue as ContentImageSize;
      continue;
    }

    if (
      key === "layout" &&
      IMAGE_LAYOUTS.has(normalizedValue as ContentImageLayout)
    ) {
      options.layout = normalizedValue as ContentImageLayout;
      continue;
    }

    if (key === "caption") {
      if (CAPTION_OFF_VALUES.has(normalizedValue)) {
        options.showCaption = false;
        options.caption = undefined;
        continue;
      }

      options.caption = rawValue;
      options.showCaption = true;
    }
  }

  return options;
}

function enhanceImageElement(node: HastNode) {
  addClassNames(node, ["content-image__media"]);
  node.properties = {
    ...node.properties,
    decoding: "async",
    loading: "lazy",
  };
}

function unwrapStandaloneImage(node: HastNode) {
  if (!isElement(node, "p") || !node.children) {
    return null;
  }

  const meaningfulChildren = node.children.filter(
    (child) => !isWhitespaceTextNode(child),
  );

  if (meaningfulChildren.length !== 1) {
    return null;
  }

  const child = meaningfulChildren[0];

  if (!child) {
    return null;
  }

  if (child.type === "element" && child.tagName === "img") {
    return {
      imageNode: child,
      mediaNode: child,
    };
  }

  if (child.type !== "element" || child.tagName !== "a") {
    return null;
  }

  if (!child.children) {
    return null;
  }

  const linkChildren = child.children.filter((item) => !isWhitespaceTextNode(item));
  const linkedImage = linkChildren[0];

  if (
    linkChildren.length !== 1 ||
    !linkedImage ||
    linkedImage.type !== "element" ||
    linkedImage.tagName !== "img"
  ) {
    return null;
  }

  addClassNames(child, ["content-figure__link"]);

  return {
    imageNode: linkedImage,
    mediaNode: child,
  };
}

function buildFigureNode(
  mediaNode: HastNode,
  imageNode: HastNode,
  options: ContentImageOptions,
) {
  const alt = readStringProperty(imageNode, "alt").trim();
  const caption = options.caption?.trim() || alt;

  if (imageNode.properties) {
    delete imageNode.properties.title;
  }

  const figureNode: HastNode = {
    type: "element",
    tagName: "figure",
    properties: {
      className: [
        "content-figure",
        `content-figure--${options.size}`,
        `content-figure--${options.layout}`,
      ],
      "data-layout": options.layout,
      "data-size": options.size,
    },
    children: [mediaNode],
  };

  if (options.showCaption && caption) {
    figureNode.children?.push({
      type: "element",
      tagName: "figcaption",
      properties: {
        className: ["content-figure__caption"],
      },
      children: [
        {
          type: "text",
          value: caption,
        },
      ],
    });
  }

  return figureNode;
}

function visitTree(node: HastNode, parent?: HastNode, index?: number) {
  if (isElement(node, "img")) {
    enhanceImageElement(node);
  }

  if (node.children) {
    node.children.forEach((child, childIndex) => {
      visitTree(child, node, childIndex);
    });
  }

  if (!parent || typeof index !== "number" || !isElement(node, "p")) {
    return;
  }

  const standaloneImage = unwrapStandaloneImage(node);

  if (!standaloneImage) {
    return;
  }

  const title = readStringProperty(standaloneImage.imageNode, "title");
  const options = parseContentImageOptions(title);

  parent.children![index] = buildFigureNode(
    standaloneImage.mediaNode,
    standaloneImage.imageNode,
    options,
  );
}

export function rehypeContentImages() {
  return (tree: HastNode) => {
    visitTree(tree);
  };
}
