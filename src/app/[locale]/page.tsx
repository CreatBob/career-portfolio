import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Layers3,
  MapPin,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import AwardsSection from "@/components/portfolio/awards-section";
import Brief from "@/components/portfolio/brief";
import Contact from "@/components/portfolio/contact";
import Education from "@/components/portfolio/education";
import NewsSection from "@/components/portfolio/news";
import ProjectsSection from "@/components/portfolio/projects-section/projects-section";
import Services from "@/components/portfolio/services";
import Skills from "@/components/portfolio/skills";
import SocialLinks from "@/components/portfolio/socallinks";
import Talks from "@/components/portfolio/talks";
import Work from "@/components/portfolio/work";
import { CustomReactMarkdown } from "@/components/react-markdown";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button, buttonVariants } from "@/components/ui/button";
import { BLUR_FADE_DELAY, siteConfig } from "@/data/site";
import { Link as I18nLink, routing } from "@/i18n/routing";
import { generatePersonJsonLd } from "@/lib/jsonld";
import { getPublishedProjectSummaries } from "@/lib/projects";
import { transformSocialData } from "@/lib/social-icons";
import { cn, getIconComponent, jsonldScript } from "@/lib/utils";

function SectionIntro({
  kicker,
  title,
  description,
  align = "left",
}: {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" && "mx-auto max-w-3xl text-center",
      )}
    >
      <div className="section-kicker">{kicker}</div>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-copy">{description}</p> : null}
    </div>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="hero-metric-card rounded-[1.75rem] px-4 py-4">
      <div className="text-foreground font-sans text-4xl leading-none font-semibold tracking-[-0.06em]">
        {value}
      </div>
      <div className="text-muted-foreground mt-2 text-sm leading-6">
        {label}
      </div>
    </div>
  );
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const locale = params.locale || routing.defaultLocale;
  const t = await getTranslations({ locale });

  const socialData = transformSocialData(
    t.raw("social") as Record<
      string,
      {
        name: string;
        url: string;
        icon: string;
        navbar?: boolean;
        content?: boolean;
        footer?: boolean;
      }
    >,
  );

  const getArrayField = <T,>(key: string): T[] => {
    try {
      const value = t.raw(key);
      return Array.isArray(value) ? (value as T[]) : [];
    } catch {
      return [];
    }
  };

  const getCollectionItems = <T,>(key: string): T[] => {
    try {
      const parentKey = key.split(".")[0];
      const collection = t.raw(parentKey) as
        | { items?: T[] | undefined }
        | undefined
        | null;

      if (
        collection &&
        typeof collection === "object" &&
        "items" in collection &&
        Array.isArray(collection.items)
      ) {
        return collection.items as T[];
      }

      return [];
    } catch {
      return [];
    }
  };

  const skills = getArrayField<string>("skills");
  const reviewerConferences = getArrayField<string>("reviewerConferences");
  const reviewerJournals = getArrayField<string>("reviewerJournals");
  const navbarItems = t.raw("navbar.items") as Array<{
    href: string;
    icon: string;
    label: string;
  }>;

  const newsItems = getCollectionItems<{
    date: string;
    title: string;
    content: string;
  }>("news.items");
  const publicationsItems = getCollectionItems<{
    title: string;
    href?: string;
    dates: string;
    active: boolean;
    description: string;
    technologies: string[];
    authors: string;
    links?: Array<{ type: string; href: string; icon: string }>;
    image?: string;
    video?: string;
  }>("publications.items");
  const educationItems = getCollectionItems<{
    school: string;
    href: string;
    degree: string;
    logoUrl: string;
    start: string;
    end: string;
  }>("education.items");
  const workItems = getCollectionItems<{
    company: string;
    href: string;
    badges: readonly string[];
    location: string;
    title: string;
    logoUrl: string;
    start: string;
    end: string;
    description: string;
  }>("work.items");
  const awardsItems = getCollectionItems<{
    year: number;
    title: string;
  }>("awards.items");
  const teachingItems = getCollectionItems<{
    date: string;
    title: string;
    location: string;
  }>("teaching.items");
  const invitedTalksItems = getCollectionItems<{
    host: string;
    url: string;
    date: string;
    title: string;
    logoUrl?: string;
  }>("invitedTalks.items");

  const personJsonLd = await generatePersonJsonLd(locale);
  const projectSummaries = await getPublishedProjectSummaries(locale);
  const blogItem = navbarItems.find((item) => item.href === "/blog");
  const resumeItem = navbarItems.find((item) => item.href.endsWith(".pdf"));
  const focusSkills = skills.slice(0, 8);
  const supportingSkills = skills.slice(0, 12);
  const leadingProject = projectSummaries[0];
  const featuredProjects = projectSummaries.slice(0, 3);
  const heroMetrics = [
    {
      value: String(projectSummaries.length).padStart(2, "0"),
      label: t("sections.selectedProjects"),
    },
    {
      value: String(skills.length).padStart(2, "0"),
      label: t("sections.skills"),
    },
    {
      value: String(workItems.length).padStart(2, "0"),
      label: t("sections.workExperience"),
    },
  ];
  const scholarLink = socialData.GoogleScholar;
  const aboutSummary = workItems.slice(0, 2).map((item) => ({
    title: item.title,
    company: item.company,
    period: `${item.start} - ${item.end}`,
  }));

  return (
    <main className="home-page relative overflow-hidden pt-28 pb-24 md:pt-32">
      {jsonldScript(personJsonLd)}

      <div className="home-page__backdrop pointer-events-none absolute inset-0 -z-10">
        <div className="home-page__glow home-page__glow--left" />
        <div className="home-page__glow home-page__glow--right" />
        <div className="home-page__grid" />
      </div>

      <section id="hero" className="portfolio-shell">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:items-end">
          <div className="space-y-8">
            <BlurFade delay={0}>
              <div className="hero-kicker">{t("welcome")}</div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY}>
              <div className="space-y-5">
                <Brief
                  name={t("name.full")}
                  firstName={t("name.given")}
                  surname={t("name.family")}
                  initials={t("name.initials")}
                  subtitle={t("subtitle")}
                  description={t("headline")}
                  avatarUrl={siteConfig.avatarUrl}
                  locale={locale}
                  showAvatar={false}
                  className="home-page__brief"
                />
                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                  <span className="hero-chip">
                    <MapPin className="size-4" />
                    {t("location.name")}
                  </span>
                  {leadingProject ? (
                    <span className="hero-chip">
                      <Layers3 className="size-4" />
                      {leadingProject.metadata.title}
                    </span>
                  ) : null}
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 2}>
              <div className="flex flex-wrap gap-3">
                <I18nLink
                  href="/projects"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "hero-primary-button rounded-full px-6 shadow-sm",
                  )}
                >
                  {locale === "zh" ? "进入作品集" : "Enter Portfolio"}
                </I18nLink>
                <a
                  href="#about"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "hero-secondary-button rounded-full px-6",
                  )}
                >
                  {locale === "zh" ? "关于我" : "About Me"}
                </a>
                {resumeItem ? (
                  <a
                    href={resumeItem.href}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" }),
                      "hero-ghost-button rounded-full px-5",
                    )}
                  >
                    {locale === "zh" ? "下载简历" : "Download Resume"}
                  </a>
                ) : null}
                {blogItem ? (
                  <I18nLink
                    href={blogItem.href}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" }),
                      "hero-ghost-button rounded-full px-5",
                    )}
                  >
                    {blogItem.label}
                  </I18nLink>
                ) : null}
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <SocialLinks
                socials={socialData}
                className="hero-social-link text-foreground/82"
              />
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="grid gap-3 sm:grid-cols-3">
                {heroMetrics.map((metric) => (
                  <MetricCard
                    key={metric.label}
                    value={metric.value}
                    label={metric.label}
                  />
                ))}
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <aside className="hero-spotlight-panel overflow-hidden px-6 py-6 sm:px-7">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="hero-kicker">
                      {locale === "zh" ? "当前定位" : "Current Focus"}
                    </div>
                    <h2 className="text-foreground text-2xl leading-tight font-semibold tracking-[-0.04em]">
                      {t("subtitle")}
                    </h2>
                  </div>
                  <Badge variant="outline" className="hero-locale-badge px-3 py-1">
                    {locale.toUpperCase()}
                  </Badge>
                </div>

                <div className="hero-spotlight-card">
                  <div className="space-y-3">
                    <div className="hero-kicker">
                      {locale === "zh" ? "代表项目" : "Featured Build"}
                    </div>
                    <div className="text-foreground text-xl leading-tight font-semibold tracking-[-0.04em]">
                      {leadingProject?.metadata.title ??
                        t("sections.selectedProjects")}
                    </div>
                    <p className="text-muted-foreground text-sm leading-7">
                      {leadingProject?.metadata.summary ?? t("headline")}
                    </p>
                  </div>

                  {leadingProject ? (
                    <div className="flex flex-wrap gap-2">
                      {(leadingProject.metadata.technologies || [])
                        .slice(0, 5)
                        .map((tech) => (
                        <span key={tech} className="hero-tech-tag">
                          {tech}
                        </span>
                        ))}
                    </div>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    {workItems.slice(0, 2).map((item) => (
                      <div
                        key={`${item.company}-${item.start}`}
                        className="hero-mini-card"
                      >
                        <div className="text-foreground text-sm font-semibold">
                          {item.title}
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm">
                          {item.company}
                        </div>
                        <div className="text-muted-foreground/75 mt-3 text-[0.68rem] tracking-[0.18em] uppercase">
                          {item.start} - {item.end}
                        </div>
                      </div>
                    ))}
                  </div>

                  <I18nLink
                    href="/projects"
                    className="text-foreground/84 hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <span>
                      {locale === "zh" ? "查看完整作品集" : "Open the full portfolio"}
                    </span>
                    <ArrowRight className="size-4" />
                  </I18nLink>
                </div>

                <div className="space-y-3">
                  <div className="hero-kicker">
                    {locale === "zh" ? "核心能力" : "Core Strengths"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {focusSkills.map((skill) => (
                      <span key={skill} className="hero-tech-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </BlurFade>
        </div>
      </section>

      {featuredProjects.length > 0 ? (
        <section id="projects" className="portfolio-shell mt-24">
          <div className="space-y-8">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <SectionIntro
                kicker={t("sections.selectedProjects")}
                title={
                  locale === "zh"
                    ? "精选案例，作为完整作品集的封面预览"
                    : "A cover spread for the full portfolio archive"
                }
                description={t("sections.checkOutLatestWork")}
              />
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
              <ProjectsSection
                projects={featuredProjects.map((project) => ({
                  title: project.metadata.title,
                  href:
                    locale === routing.defaultLocale
                      ? `/projects/${project.slug}`
                      : `/${locale}/projects/${project.slug}`,
                  dates: project.metadata.dates,
                  active: Boolean(project.metadata.featured),
                  description: project.metadata.summary,
                  technologies: project.metadata.technologies || [],
                  authors: `**Role:** ${project.metadata.role}`,
                  image: project.metadata.cover,
                  links: (project.metadata.links || []).map((link) => ({
                    type: link.label,
                    href: link.href,
                    icon: <ArrowRight className="size-3.5" />,
                  })),
                }))}
                mobileDisplayCount={3}
                desktopDisplayCount={3}
                featuredFirst={true}
              />
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <div className="flex justify-center">
                <Button asChild className="hero-primary-button rounded-full px-6 shadow-sm">
                  <I18nLink href="/projects">
                    <span>{t("portfolioArchive.enterArchive")}</span>
                    <ArrowRight className="size-4" />
                  </I18nLink>
                </Button>
              </div>
            </BlurFade>
          </div>
        </section>
      ) : null}

      <section id="about" className="portfolio-shell mt-24">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] xl:items-start">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="space-y-8">
              <SectionIntro
                kicker={t("sections.about")}
                title={t("subtitle")}
                description={t("blogTagline")}
              />
              <div className="home-about-panel px-6 py-6 sm:px-7 sm:py-7">
                <div className="text-foreground/78 prose max-w-none text-base leading-8 [&_img]:my-0 [&_img]:inline-block [&_img]:h-[1em] [&_img]:w-auto [&_img]:align-baseline">
                  <CustomReactMarkdown>{t("bioMarkdown")}</CustomReactMarkdown>
                </div>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="space-y-6">
              <div className="home-about-panel px-6 py-6 sm:px-7">
                <div className="space-y-4">
                  <div className="hero-kicker">
                    {locale === "zh" ? "正在做什么" : "What I Build"}
                  </div>
                  <div className="space-y-3">
                    {aboutSummary.map((item) => (
                      <div key={`${item.company}-${item.period}`} className="hero-mini-card">
                        <div className="text-foreground text-sm font-semibold">
                          {item.title}
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm">
                          {item.company}
                        </div>
                        <div className="text-muted-foreground/75 mt-3 text-[0.68rem] tracking-[0.18em] uppercase">
                          {item.period}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="home-about-panel px-6 py-6 sm:px-7">
                <div className="space-y-4">
                  <div className="hero-kicker">
                    {locale === "zh" ? "技术关键词" : "Stack Snapshot"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {supportingSkills.map((skill) => (
                      <span key={skill} className="hero-tech-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {newsItems.length > 0 ? (
        <section id="news" className="portfolio-shell mt-24">
          <div className="editorial-panel px-6 py-6 sm:px-7">
            <NewsSection
              news={newsItems}
              delay={BLUR_FADE_DELAY * 4}
              title={t("sections.news.title")}
              showAllText={t("showAll")}
            />
          </div>
        </section>
      ) : null}

      <section className="portfolio-shell mt-24">
        <div className="space-y-8">
          <SectionIntro
            kicker={locale === "zh" ? "更多背景" : "More Context"}
            title={
              locale === "zh"
                ? "经历、技能与教育"
                : "Experience, skills and education"
            }
            description={t("headline")}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            {skills.length > 0 ? (
              <div id="skills" className="editorial-panel px-6 py-6 sm:px-7">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="bg-foreground text-background flex size-10 items-center justify-center rounded-full">
                      <Layers3 className="size-4" />
                    </span>
                    <div>
                      <div className="section-kicker">{t("sections.skills")}</div>
                      <h2 className="font-serif text-3xl leading-none font-medium">
                        {t("sections.skills")}
                      </h2>
                    </div>
                  </div>
                  <Skills skills={skills} />
                </div>
              </div>
            ) : null}

            <div className="grid gap-6">
              {workItems.length > 0 ? (
                <div id="work" className="editorial-panel px-6 py-6 sm:px-7">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="bg-foreground text-background flex size-10 items-center justify-center rounded-full">
                        <BriefcaseBusiness className="size-4" />
                      </span>
                      <div>
                        <div className="section-kicker">
                          {t("sections.workExperience")}
                        </div>
                        <h2 className="font-serif text-3xl leading-none font-medium">
                          {t("sections.workExperience")}
                        </h2>
                      </div>
                    </div>
                    <Work work={workItems} />
                  </div>
                </div>
              ) : null}

              {educationItems.length > 0 ? (
                <div id="education" className="editorial-panel px-6 py-6 sm:px-7">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="bg-foreground text-background flex size-10 items-center justify-center rounded-full">
                        <GraduationCap className="size-4" />
                      </span>
                      <div>
                        <div className="section-kicker">
                          {t("sections.education")}
                        </div>
                        <h2 className="font-serif text-3xl leading-none font-medium">
                          {t("sections.education")}
                        </h2>
                      </div>
                    </div>
                    <Education educations={educationItems} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {publicationsItems.length > 0 ? (
        <section id="publications" className="portfolio-shell mt-24">
          <div className="space-y-8">
            <SectionIntro
              kicker={t("sections.research")}
              title={t("sections.publications.title")}
              description={
                scholarLink
                  ? `${t("sections.viewFullPublications")} ${scholarLink.name}`
                  : undefined
              }
            />
            <ProjectsSection
              projects={publicationsItems.map((project) => ({
                ...project,
                links: project.links?.map((link) => ({
                  ...link,
                  icon: getIconComponent(link.icon),
                })),
              }))}
              mobileDisplayCount={6}
              desktopDisplayCount={6}
              showAllText={t("showAll")}
            />
          </div>
        </section>
      ) : null}

      {awardsItems.length > 0 ? (
        <section id="awards" className="portfolio-shell mt-24">
          <div className="editorial-panel px-6 py-6 sm:px-7">
            <div className="space-y-5">
              <SectionIntro
                kicker={t("sections.awards")}
                title={t("sections.awards")}
              />
              <AwardsSection awards={awardsItems} showAllText={t("showAll")} />
            </div>
          </div>
        </section>
      ) : null}

      {reviewerConferences.length > 0 ||
      reviewerJournals.length > 0 ||
      teachingItems.length > 0 ? (
        <section id="academic-services" className="portfolio-shell mt-24">
          <div className="editorial-panel px-6 py-6 sm:px-7">
            <div className="space-y-5">
              <SectionIntro
                kicker={t("sections.academicServices")}
                title={t("sections.academicServices")}
              />
              <Services
                reviewerConferences={reviewerConferences}
                reviewerJournals={reviewerJournals}
                teaching={teachingItems}
                reviewerConferencesLabel={t(
                  "sections.teaching.reviewerConferencesLabel",
                )}
                reviewerJournalsLabel={t(
                  "sections.teaching.reviewerJournalsLabel",
                )}
                teachingLabel={t("sections.teaching.teachingLabel")}
              />
            </div>
          </div>
        </section>
      ) : null}

      {invitedTalksItems.length > 0 ? (
        <section id="invited-talks" className="portfolio-shell mt-24">
          <div className="editorial-panel px-6 py-6 sm:px-7">
            <div className="space-y-5">
              <SectionIntro
                kicker={t("sections.invitedTalks.title")}
                title={t("sections.invitedTalks.title")}
              />
              <Talks talks={invitedTalksItems} showAllText={t("showAll")} />
            </div>
          </div>
        </section>
      ) : null}

      <section id="contact" className="portfolio-shell mt-24">
        <Contact
          emailUrl={socialData.email.url}
          calendlyUrl={socialData.calendly?.url}
          contactLabel={t("sections.contact")}
          getInTouch={t("sections.getInTouch")}
          contactDescription={t("sections.contactDescription")}
          viaEmail={t("sections.viaEmail")}
          askQuestions={t("sections.askQuestions")}
          exploreCollaboration={t("sections.exploreCollaboration")}
          coffeeChat={t("sections.coffeeChat")}
          schedule={t("sections.schedule")}
        />
      </section>
    </main>
  );
}
