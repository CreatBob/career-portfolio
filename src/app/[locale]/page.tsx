import {
  BriefcaseBusiness,
  GraduationCap,
  Layers3,
  MapPin,
} from "lucide-react";
import Link from "next/link";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BLUR_FADE_DELAY, siteConfig } from "@/data/site";
import { Link as I18nLink, routing } from "@/i18n/routing";
import { generatePersonJsonLd } from "@/lib/jsonld";
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
    <div className="editorial-card rounded-[1.75rem] px-4 py-4">
      <div className="font-serif text-4xl leading-none font-medium tracking-[-0.05em]">
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
  const projectsItems = getCollectionItems<{
    slug: string;
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
  }>("projects.items");
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
  const blogItem = navbarItems.find((item) => item.href === "/blog");
  const resumeItem = navbarItems.find((item) => item.href.endsWith(".pdf"));
  const focusSkills = skills.slice(0, 8);
  const heroMetrics = [
    {
      value: String(projectsItems.length).padStart(2, "0"),
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

  return (
    <main className="relative overflow-hidden pt-28 pb-24 md:pt-32">
      {jsonldScript(personJsonLd)}

      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(244,130,77,0.18),transparent_48%)] blur-3xl dark:bg-[radial-gradient(circle_at_top,rgba(244,130,77,0.22),transparent_48%)]" />

      <section id="hero" className="portfolio-shell">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-start">
          <div className="space-y-7">
            <BlurFade delay={0}>
              <div className="section-kicker">{t("welcome")}</div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY}>
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
              />
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 2}>
              <div className="flex flex-wrap gap-3">
                {blogItem ? (
                  <I18nLink
                    href={blogItem.href}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-full px-6 shadow-sm",
                    )}
                  >
                    {blogItem.label}
                  </I18nLink>
                ) : null}
                {resumeItem ? (
                  <a
                    href={resumeItem.href}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "border-border/70 rounded-full bg-white/72 px-6 shadow-sm dark:bg-white/6",
                    )}
                  >
                    {resumeItem.label}
                  </a>
                ) : null}
                <a
                  href="#contact"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "rounded-full px-5",
                  )}
                >
                  {t("sections.contact")}
                </a>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <SocialLinks socials={socialData} />
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
            <aside className="editorial-panel sticky top-28 overflow-hidden px-6 py-6 sm:px-7">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="section-kicker">{t("location.name")}</div>
                    <Link
                      href={t("location.mapUrl")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                      <MapPin className="size-4" />
                      <span>{t("location.name")}</span>
                    </Link>
                  </div>
                  <Badge
                    variant="outline"
                    className="luxury-tag px-3 py-1"
                  >
                    {locale.toUpperCase()}
                  </Badge>
                </div>

                <Avatar className="border-border/70 mx-auto size-44 rounded-[2rem] border shadow-[0_24px_48px_-32px_rgba(15,23,42,0.5)] sm:size-48">
                  <AvatarImage
                    alt={t("name.full")}
                    src={siteConfig.avatarUrl}
                    className="object-cover"
                  />
                  <AvatarFallback>{t("name.initials")}</AvatarFallback>
                </Avatar>

                <div className="space-y-3">
                  <div className="section-kicker">{t("sections.skills")}</div>
                  <div className="flex flex-wrap gap-2">
                    {focusSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="luxury-tag px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {workItems.length > 0 ? (
                  <>
                    <Separator className="bg-border/60" />
                    <div className="space-y-3">
                      <div className="section-kicker">
                        {t("sections.workExperience")}
                      </div>
                      <div className="space-y-3">
                        {workItems.slice(0, 2).map((item) => (
                          <div
                            key={`${item.company}-${item.start}`}
                            className="border-border/60 rounded-[1.4rem] border bg-white/70 px-4 py-4 dark:bg-white/6"
                          >
                            <div className="text-foreground text-sm font-semibold">
                              {item.title}
                            </div>
                            <div className="text-muted-foreground mt-1 text-sm">
                              {item.company}
                            </div>
                            <div className="text-muted-foreground mt-3 font-mono text-[0.68rem] tracking-[0.16em] uppercase">
                              {item.start} - {item.end}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </aside>
          </BlurFade>
        </div>
      </section>

      <section id="about" className="portfolio-shell mt-24">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <SectionIntro
              kicker={t("sections.about")}
              title={t("subtitle")}
              description={t("blogTagline")}
            />
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="editorial-panel px-6 py-6 sm:px-7 sm:py-7">
              <div className="prose text-muted-foreground dark:prose-invert max-w-none text-base leading-8 [&_img]:my-0 [&_img]:inline-block [&_img]:h-[1em] [&_img]:w-auto [&_img]:align-baseline">
                <CustomReactMarkdown>{t("bioMarkdown")}</CustomReactMarkdown>
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

      {projectsItems.length > 0 ? (
        <section id="projects" className="portfolio-shell mt-24">
          <div className="space-y-8">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <SectionIntro
                kicker={t("sections.selectedProjects")}
                title={t("sections.checkOutLatestWork")}
                description={t("headline")}
              />
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
              <ProjectsSection
                projects={projectsItems.map((project) => ({
                  ...project,
                  href:
                    locale === routing.defaultLocale
                      ? `/projects/${project.slug}`
                      : `/${locale}/projects/${project.slug}`,
                  links: project.links?.map((link) => ({
                    ...link,
                    icon: getIconComponent(link.icon),
                  })),
                }))}
                mobileDisplayCount={4}
                desktopDisplayCount={3}
                showAllText={t("showAll")}
                featuredFirst={true}
              />
            </BlurFade>
          </div>
        </section>
      ) : null}

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

      <section className="portfolio-shell mt-24">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
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
      </section>

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
