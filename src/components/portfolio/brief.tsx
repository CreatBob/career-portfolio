import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function Brief({
  name,
  firstName,
  surname,
  initials,
  subtitle,
  description,
  avatarUrl,
  className = "",
  locale,
  showAvatar = true,
}: {
  name: string;
  firstName?: string;
  surname?: string;
  initials: string;
  subtitle: string;
  description: string;
  avatarUrl: string;
  className?: string;
  locale?: string;
  showAvatar?: boolean;
}) {
  const isChinese = locale === "zh";

  return (
    <div
      className={cn(
        "flex flex-col gap-5 text-left",
        showAvatar &&
          "flex-col-reverse items-start justify-between sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-3">
        <h1
          className={cn("hero-title max-w-5xl text-balance")}
        >
          {firstName && surname ? (
            isChinese ? (
              `${surname}${firstName}`
            ) : (
              <>
                <span>{firstName}</span>{" "}
                <span className="inline-block w-3"></span>
                <span>{surname}</span>
              </>
            )
          ) : (
            name
          )}
        </h1>
        <p
          className={cn(
            "editorial-subtitle",
            isChinese && "text-[0.88rem] tracking-[0.16em] sm:text-[0.96rem]",
          )}
        >
          {subtitle}
        </p>
        <p
          className={cn(
            "editorial-lead whitespace-pre-line",
            isChinese && "max-w-4xl text-[1.02rem] leading-8 md:text-[1.12rem]",
          )}
        >
          {description}
        </p>
      </div>
      {showAvatar ? (
        <Avatar className="surface-outline size-24 rounded-[1.75rem] sm:size-28 md:size-32 lg:size-36">
          <AvatarImage alt={name} src={avatarUrl} className="object-cover" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
}
