import { NextRequest, NextResponse } from "next/server";
import { BIRTHDAY_COOKIE, BIRTHDAY_RE } from "./lib/today";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const b = request.nextUrl.searchParams.get("b");
  if (b && BIRTHDAY_RE.test(b)) {
    response.cookies.set(BIRTHDAY_COOKIE, b, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/today", "/today/:date*"],
};
