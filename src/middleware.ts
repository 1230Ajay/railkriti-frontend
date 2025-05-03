import { NextResponse, NextRequest } from "next/server";
import { isTimePassed } from "./lib/helper/calculate.is.time.passed";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });// Get JWT from cookies
    const url = request.nextUrl;


    // List of allowed unauthenticated routes
    const allowedUnauthenticatedUrls: string[] = [
        "/change-email",
        "/forgot-password-otp",
        "/forgot-password",
        "/sign-in",
        "/sign-up",
        "/verify",
        "/resend-verification"
    ];

    // Handle authenticated users trying to access unauthenticated pages
    if (token && (allowedUnauthenticatedUrls.includes(url.pathname) || url.pathname === "/")) {
        return NextResponse.redirect(new URL('/application', request.url));
    }

    // Handle unauthenticated users trying to access protected routes
    if (!token && !allowedUnauthenticatedUrls.includes(url.pathname)) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|images|fonts|css|js|svg|png|jpg|jpeg|gif|webp|avif|tiff|bmp|ico|woff|woff2|ttf|otf|eot).*)',
    ],
};
