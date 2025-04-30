// middleware.ts
import { I18nMiddleware } from "@/middleware";
import { NextRequest, NextResponse } from "next/server";

export function homedMiddleware(request: NextRequest) {
  if (request.cookies.get("auth-token")?.value) {
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }
  // no need to concern about invalid token as it will be handled by authorizedMiddleware

  return I18nMiddleware(request);
}
