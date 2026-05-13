import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import HeroTypewriter from "@/components/portfolio/hero-typewriter";
import { buttonVariants } from "@/components/ui/button";
import { Link as I18nLink, routing } from "@/i18n/routing";
import { generatePersonJsonLd } from "@/lib/jsonld";
import { transformSocialData } from "@/lib/social-icons";
import { cn, jsonldScript } from "@/lib/utils";

type NavbarItem = {
  href: string;
  icon: string;
  label: string;
};

function getArrayField<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
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
  const navbarItems = t.raw("navbar.items") as NavbarItem[];
  const personJsonLd = await generatePersonJsonLd(locale);
  const resumeItem = navbarItems.find((item) => item.href.endsWith(".pdf"));
  const typewriterPhrases = getArrayField<string>(
    t.raw("homeHero.typewriterPhrases"),
  );
  const heroDescriptionLine1 = t.rich("homeHero.descriptionLine1", {
    reading: (chunks) => (
      <strong className="home-hero__highlight home-hero__highlight--reading">
        {chunks}
      </strong>
    ),
    newThings: (chunks) => (
      <strong className="home-hero__highlight home-hero__highlight--discovery">
        {chunks}
      </strong>
    ),
    excellence: (chunks) => (
      <strong className="home-hero__highlight home-hero__highlight--excellence">
        {chunks}
      </strong>
    ),
  });

  return (
    <main className="home-page relative">
      {jsonldScript(personJsonLd)}

      <section id="hero" className="home-hero">
        <div className="home-hero__content" aria-labelledby="home-hero-title">
          <p className="home-hero__greeting">{t("homeHero.greeting")}</p>

          <h1 id="home-hero-title" className="home-hero__title">
            <span>{t("homeHero.displayName")}</span>
            <span className="home-hero__alias">
              {" | "}
              {t("homeHero.alias")}
            </span>
          </h1>

          <HeroTypewriter
            phrases={typewriterPhrases}
            className="home-hero__typewriter"
          />

          <p className="home-hero__description">
            <span className="home-hero__description-line">
              {heroDescriptionLine1}
            </span>
            <span className="home-hero__description-line">
              {t("homeHero.descriptionLine2")}
            </span>
          </p>

          <div className="home-hero__actions" aria-label={t("homeHero.actionsLabel")}>
            <a
              href={resumeItem?.href ?? "/resume.pdf"}
              className={cn(
                buttonVariants({ size: "lg" }),
                "home-hero__button home-hero__button--primary",
              )}
            >
              {t("homeHero.resumeCta")}
            </a>
            <I18nLink
              href="/projects"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "home-hero__button home-hero__button--secondary",
              )}
            >
              <span>{t("homeHero.projectsCta")}</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </I18nLink>
          </div>

          <div className="home-hero__socials" aria-label={t("homeHero.socialsLabel")}>
            {Object.values(socialData)
              .filter((social) => social.content)
              .map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    social.url.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="home-social-link"
                  aria-label={social.name}
                  data-social={social.name.toLowerCase()}
                >
                  <social.icon className="size-5" aria-hidden="true" />
                </a>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
