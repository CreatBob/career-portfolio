import Link from "next/link";

import { cn } from "@/lib/utils";

interface Social {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  navbar?: boolean;
  content?: boolean;
  footer?: boolean;
}

export default function SocialLinks({
  socials,
  className,
}: {
  socials: Record<string, Social>;
  delay?: number;
  className?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {Object.values(socials)
        .filter((social) => social.content)
        .map((social) => (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group editorial-card hover:border-foreground/20 hover:text-foreground inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-[0.95rem] font-medium tracking-[-0.01em] transition-transform duration-300 hover:-translate-y-0.5",
              className,
            )}
          >
            <span className="bg-foreground text-background flex size-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105">
              <social.icon className="size-4" />
            </span>
            <span>{social.name}</span>
          </Link>
        ))}
    </div>
  );
}
