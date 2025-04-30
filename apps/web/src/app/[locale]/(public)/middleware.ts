// middleware.ts
import { I18nMiddleware } from "@/middleware";
import { NextRequest } from "next/server";

export const PUBLIC_PATHS = ["/auth/signin"];

export function publicMiddleware(request: NextRequest) {
  return I18nMiddleware(request);
}
