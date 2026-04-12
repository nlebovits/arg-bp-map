import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Next.js 16: Export named `proxy` function (middleware convention is deprecated)
export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals (_next)
  // - Static files (images, fonts, etc.)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
