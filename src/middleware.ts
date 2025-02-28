import { NextResponse, NextRequest } from "next/server";
import { isTimePassed } from "./lib/helper/calculate.is.time.passed";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('jwt')?.value; // Get JWT from cookies
    const url = request.nextUrl;

    // Check if the user needs to be logged out
    if (token) {
        const logoutResponse = checkLogOut(request);
        if (logoutResponse) return logoutResponse;
    }

    // List of allowed unauthenticated routes
    const allowedUnauthenticatedUrls: string[] = [
        "/change-email",
        "/forgot-password-otp",
        "/forgot-password",
        "/change-mobile",
        "/sign-in",
        "/sign-up",
        "/verify",
        "/verified",
        "/change-password-by-email-or-username"
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


const checkLogOut = (request: NextRequest): NextResponse | null => {
    const loginTime = getLoginTime(request);
    const parsedTime = loginTime ? Number(loginTime) : null;
    const hasTimePassed = isTimePassed(parsedTime, 60);
    
    if (hasTimePassed) {
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.delete('jwt'); // Ensure token is removed
        return response;
    }

    return null;
};

const getLoginTime = (request: NextRequest): number => {
    const storedTime = request.cookies.get("login_time")?.value;
    return storedTime ? Number(storedTime) : Date.now() - 60 * 60 * 1000;
};

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|images|fonts|css|js|svg|png|jpg|jpeg|gif|webp|avif|tiff|bmp|ico|woff|woff2|ttf|otf|eot).*)',
    ],
};
