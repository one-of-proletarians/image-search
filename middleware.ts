import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const auth = cookies().get("Authorization");
  const isLogin = request.nextUrl.pathname.includes("login");

  if (auth && isLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (!auth && !isLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/search"],
};
