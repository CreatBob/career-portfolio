import { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/routing";
import { getPublishedBlogPosts } from "@/lib/blog";

const siteUrl = siteConfig.url;

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never"
  | undefined;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/blog", "/privacy-policy", "/terms-of-service"];

  const pages = LOCALES.flatMap((locale) => {
    return staticPages.map((page) => ({
      url: `${siteUrl}${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${page}`,
      lastModified: new Date(),
      changeFrequency: (["", "/blog"].includes(page)
        ? "weekly"
        : "monthly") as ChangeFrequency,
      priority: page === "" ? 1.0 : page === "/blog" ? 0.8 : 0.5,
    }));
  });

  const blogEntries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const posts = await getPublishedBlogPosts(locale);
    posts.forEach((post) => {
      blogEntries.push({
        url: `${siteUrl}${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/blog/${post.slug}`,
        lastModified: post.metadata.updatedAt
          ? new Date(post.metadata.updatedAt as string)
          : new Date(post.metadata.date),
        changeFrequency: "monthly" as ChangeFrequency,
        priority: 0.7,
      });
    });
  }

  return [...pages, ...blogEntries];
}
