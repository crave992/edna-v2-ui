import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export { withAuth } from "next-auth/middleware";

// Force-redirect every HTTP request to HTTPS
function forceHTTPS(req) {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers?.get("x-forwarded-proto") !== "https" &&
    // This check prevents us from getting trapped in HTTPS localhost if we are
    // testing a production build locally via `next build && next start`; we
    // can use `req.headers.get('host')` to get the true host (e.g.
    // 'example.com'), whereas `req.nextUrl.host` is always
    // 'localhost:3000'
    !req.headers.get("host")?.includes("localhost") &&
    !req.headers.get("host")?.includes("dev")
  ) {
    return NextResponse.redirect(
      `https://${req.headers.get("host")}${req.nextUrl.pathname}`,
      301
    );
  }
}

// Redirect every www request to the non-www equivalent
function redirectWwwToNonWww(req) {
  const host = req.headers.get("host") || "";
  const wwwRegex = /^www\./;
  if (
    wwwRegex.test(host) &&
    !req.headers.get("host")?.includes("localhost") &&
    !req.headers.get("host")?.includes("dev")
  ) {
    const newHost = host.replace(wwwRegex, "");
    return NextResponse.redirect(
      `https://${newHost}${req.nextUrl.pathname}`,
      301
    );
  }
}

// Sequentially process an array of middleware functions (this function is to
// avoid repetition and produce cleaner code)
function processMiddlewareFunctions(req, middlewareFns) {
  for (const middlewareFn of middlewareFns) {
    const fnResponse = middlewareFn(req);
    if (fnResponse) {
      return fnResponse;
    }
  }
}

export function middleware_test(req) {
  const response = processMiddlewareFunctions(req, [
    forceHTTPS,
    redirectWwwToNonWww,
  ]);

  if (response) {
    return response;
  }

  // These are protected routes.
  if (
    req.nextUrl.pathname.startsWith("/jobs") ||
    req.nextUrl.pathname.startsWith("/accounts") ||
    req.nextUrl.pathname.startsWith("/uploads") ||
    req.nextUrl.pathname.startsWith("/profile")
  ) {
    return withAuth(req);
  }
}
