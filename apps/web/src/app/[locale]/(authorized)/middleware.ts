// middleware.ts
import { EXPIRE_AFTER_FIVE_YEAR } from "@/constants";
import { JWT_SECRET_KEY } from "@/constants/auth";
import { I18nMiddleware } from "@/middleware";
import * as jwt from "jose";
import { NextRequest, NextResponse } from "next/server";

export const AUTHORIZED_PATHS = ["/dashboard", "/templates", "/my-documents", "/account", "/document"];

export async function authorizedMiddleware(request: NextRequest) {
  if (!request.cookies.get("auth-token")?.value) {
    //no auth token
    request.cookies.set("next-auth.redirect-url", request.nextUrl.pathname); //redirect url after signin
    const response = NextResponse.redirect(new URL(`/auth/signin`, request.url)); //redirect to signin page
    response.cookies.set("next-auth.redirect-url", request.nextUrl.pathname); //redirect url after signin
    return response;
  } else {
    // Redirect to signin page if not authenticated
    let decodedUser = null as null | { user_id: string };

    try {
      decodedUser = (await jwt.jwtVerify(request.cookies.get("auth-token")?.value || "", JWT_SECRET_KEY)).payload as {
        user_id: string;
      };
    } catch (error) {
      console.log("invalid token", error);
    }

    if (!decodedUser?.user_id) {
      //invalid token
      request.cookies.set("next-auth.redirect-url", request.nextUrl.pathname); //redirect after signin
      const response = NextResponse.redirect(new URL("/auth/signin", request.url));
      response.cookies.set("next-auth.redirect-url", request.nextUrl.pathname); //redirect after signin
      response.cookies.delete("auth-token");
      response.cookies.delete("user_id");
      return response;
    } else {
      //set cookies
      const requestWithCookies = request;
      requestWithCookies.cookies.set("user_id", decodedUser.user_id);
      const response = I18nMiddleware(requestWithCookies);
      response.cookies.set("user_id", decodedUser.user_id, {
        //set user_id in cookies (if user edited it by devtools then it will be updated)
        expires: EXPIRE_AFTER_FIVE_YEAR,
      });

      return response;
    }
  }
}
