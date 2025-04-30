// middleware.ts
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";
import { AUTHORIZED_PATHS, authorizedMiddleware } from "./app/[locale]/(authorized)/middleware";
import { homedMiddleware } from "./app/[locale]/(home)/middleware";
import { PUBLIC_PATHS, publicMiddleware } from "./app/[locale]/(public)/middleware";
import { DEFAULT_LOCAL, LOCALS } from "./constants/locale";

export const locales = ["en", "bn"];

export const I18nMiddleware = createI18nMiddleware({
  locales: LOCALS,
  defaultLocale: DEFAULT_LOCAL,
  urlMappingStrategy: "rewriteDefault",
});

export function middleware(request: NextRequest) {
  switch (true) {
    case !!LOCALS.find((locale) => request.nextUrl.pathname === `/${locale === DEFAULT_LOCAL ? "" : locale}`):
      console.log("homedMiddleware");
      return homedMiddleware(request);

    case !!AUTHORIZED_PATHS.find((path) => request.nextUrl.pathname.includes(path)):
      console.log("authorizediddleware");
      return authorizedMiddleware(request);

    case !!PUBLIC_PATHS.find((path) => request.nextUrl.pathname.includes(path)):
      console.log("publicMiddleware");
      return publicMiddleware(request);
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
