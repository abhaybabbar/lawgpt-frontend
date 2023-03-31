import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();

  let isLogin = request.cookies.get("token");

  if (!isLogin) {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.rewrite(new URL("/login", request.url));
    }
  } else {
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.rewrite(new URL("/", request.url));
    }
  }
}
