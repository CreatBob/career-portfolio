import Link from "next/link";

interface ContactProps {
  emailUrl: string;
  calendlyUrl?: string;
  contactLabel?: string;
  getInTouch?: string;
  contactDescription?: string;
  viaEmail?: string;
  askQuestions?: string;
  exploreCollaboration?: string;
  coffeeChat?: string;
  schedule?: string;
}

export default function Contact({
  emailUrl,
  calendlyUrl,
  contactLabel = "Contact",
  getInTouch = "Get in Touch",
  contactDescription = "Want to chat? Feel free to reach out",
  viaEmail = "via email",
  askQuestions = "Ask questions",
  exploreCollaboration = "Explore collaboration opportunities",
  coffeeChat = "15-minute coffee chat",
  schedule = "Schedule",
}: ContactProps) {
  return (
    <div className="editorial-panel grain-mask relative overflow-hidden px-6 py-8 text-left sm:px-8 lg:px-10">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-[hsl(var(--spotlight)/0.12)] to-transparent lg:block" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
        <div className="space-y-4">
          <div className="section-kicker">{contactLabel}</div>
          <h2 className="font-serif text-4xl leading-none font-medium sm:text-5xl">
            {getInTouch}
          </h2>
          <p className="section-copy max-w-2xl">{contactDescription}</p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={emailUrl}
              className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span>{viaEmail}</span>
              <span>↗</span>
            </Link>
            {calendlyUrl ? (
              <Link
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border/70 inline-flex items-center gap-2 rounded-full border bg-white/70 px-5 py-3 text-sm font-medium shadow-sm backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white/6"
              >
                <span>{schedule}</span>
                <span>↗</span>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          <div className="section-kicker">{getInTouch}</div>
          <div className="grid gap-3">
            <div className="editorial-card rounded-[1.75rem] px-4 py-4">
              <p className="text-sm font-medium">{askQuestions}</p>
            </div>
            <div className="editorial-card rounded-[1.75rem] px-4 py-4">
              <p className="text-sm font-medium">{exploreCollaboration}</p>
            </div>
            {calendlyUrl ? (
              <div className="editorial-card rounded-[1.75rem] px-4 py-4">
                <p className="text-sm font-medium">
                  {coffeeChat} · {schedule}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
