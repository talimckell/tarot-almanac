import { NextRequest, NextResponse } from "next/server";
import { BIRTHDAY_COOKIE, BIRTHDAY_RE, isOldEnough, type YMD } from "./lib/today";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const b = request.nextUrl.searchParams.get("b");
  if (b && BIRTHDAY_RE.test(b)) {
    const [byStr, bmStr, bdStr] = b.split("-");
    const now = new Date();
    const nowYMD: YMD = { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, d: now.getUTCDate() };
    // An under-16 birthdate is never even remembered — same treatment as if ?b=
    // were never there, so a shared link can't quietly persist it via the cookie.
    if (isOldEnough(Number(byStr), Number(bmStr), Number(bdStr), nowYMD)) {
      response.cookies.set(BIRTHDAY_COOKIE, b, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
  }
  return response;
}

export const config = {
  matcher: ["/today", "/today/:date*"],
};
