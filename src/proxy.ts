import createIntlProxy from "next-intl/middleware";

import { routing } from "@/i18n/routing";

export const proxy = createIntlProxy(routing);

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|open-source/nextjs-portfolio-blog-research|.*\\..*).*)",
  ],
};
