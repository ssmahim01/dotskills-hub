/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

enum Role {
  ADMIN = "ADMIN",
  OWNER = "OWNER",
}

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_ACCESS_SECRET,
    );

    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const accessToken =
    req.cookies.get("accessToken")?.value;

  const isDashboardRoute =
    pathname.includes("/dashboard");

  if (!isDashboardRoute) {
    return NextResponse.next();
  }

  // Not logged in
  if (!accessToken) {
    return NextResponse.redirect(
      new URL("/login", req.url),
    );
  }

  const payload: any =
    await verifyToken(accessToken);

  // Invalid token
  if (!payload) {
    return NextResponse.redirect(
      new URL("/login", req.url),
    );
  }

  const role =
    payload.role || payload.user?.role;

  if (!role) {
    return NextResponse.redirect(
      new URL("/login", req.url),
    );
  }

  // Admin dashboard access
  if (pathname.startsWith("/dashboard")) {
    if (role !== Role.ADMIN) {
      return NextResponse.redirect(
        new URL("/", req.url),
      );
    }

    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);

  const requestedStoreSlug = segments[0];

  if (!requestedStoreSlug) {
    return NextResponse.next();
  }

  // Admin can access any tenant
  if (role === Role.ADMIN) {
    return NextResponse.next();
  }

  // Owner validation
  const ownerStoreSlug =
    payload.storeSlug ||
    payload.user?.storeSlug;

  if (!ownerStoreSlug) {
    return NextResponse.redirect(
      new URL("/login", req.url),
    );
  }

  // Prevent owner accessing another store
  if (requestedStoreSlug !== ownerStoreSlug) {
    return NextResponse.redirect(
      new URL(
        `/${ownerStoreSlug}/dashboard`,
        req.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/:storeSlug/dashboard/:path*",
  ],
};