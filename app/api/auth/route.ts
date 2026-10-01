import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Step 1 of the GitHub OAuth dance: send the CMS popup to GitHub.
 *
 * Decap's GitHub backend opens `{base_url}/{auth_endpoint}?provider=github&...`
 * in a popup and waits for that window to post a token back. Hosting this in
 * the site itself means the client secret lives in this project's environment
 * and the GitHub token is never handed to a third-party server.
 *
 * `public_repo` rather than `repo`, deliberately. A GitHub OAuth token is
 * account-wide, not per-repository, so `repo` would also grant write access to
 * every private repository on the account. This repo is public, so the narrower
 * scope is enough. Set GITHUB_OAUTH_SCOPE=repo if it ever goes private.
 */

const STATE_COOKIE = "decap_oauth_state";

function configError(message: string) {
  // A readable message beats an unhandled throw, which Vercel surfaces only as
  // FUNCTION_INVOCATION_FAILED with no clue as to the cause.
  return new NextResponse(
    `OAuth is not configured: ${message}\n\n` +
      `Set GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET in this ` +
      `project's environment variables, then redeploy. Vercel only injects ` +
      `environment variables at deploy time, so adding them is not enough on ` +
      `its own.\n`,
    { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } },
  );
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) return configError("GITHUB_OAUTH_CLIENT_ID is missing");
  if (!process.env.GITHUB_OAUTH_CLIENT_SECRET) {
    return configError("GITHUB_OAUTH_CLIENT_SECRET is missing");
  }

  const { origin } = new URL(request.url);
  const state = randomBytes(16).toString("hex");

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${origin}/api/callback`);
  authorize.searchParams.set("scope", process.env.GITHUB_OAUTH_SCOPE ?? "public_repo");
  authorize.searchParams.set("state", state);

  const response = NextResponse.redirect(authorize.toString());

  // Round-trip the state through an httpOnly cookie so the callback can prove
  // the response belongs to a handshake this site actually started.
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: origin.startsWith("https://"),
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
