import { NextResponse, type NextRequest } from "next/server";

/**
 * Step 2: GitHub redirects here with a code; swap it for a token and hand that
 * token to the CMS window that opened this popup.
 *
 * The handshake Decap expects, in order:
 *   1. this popup posts "authorizing:github" to its opener
 *   2. the opener replies with a message, which tells us its origin
 *   3. this popup posts "authorization:github:success:{json}" back
 */

const STATE_COOKIE = "decap_oauth_state";

/**
 * Escapes a value for an HTML attribute.
 *
 * The payload is handed to the page through a data- attribute rather than
 * interpolated into a JavaScript string literal. That keeps the escaping to
 * four plain characters, with no backslash sequences to get wrong, and leaves
 * no way for the token or an error message to break out into executable code.
 */
function toAttribute(value: unknown): string {
  return JSON.stringify(value)
    .split("&")
    .join("&amp;")
    .split("<")
    .join("&lt;")
    .split(">")
    .join("&gt;")
    .split('"')
    .join("&quot;");
}

function popupPage(status: "success" | "error", content: unknown) {
  const payload = `authorization:github:${status}:${JSON.stringify(content)}`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><title>Signing in</title></head>
<body style="font:14px system-ui;padding:24px">
<p id="status" data-payload="${toAttribute(payload)}">Completing sign-in...</p>
<script>
  (function () {
    var node = document.getElementById("status");
    var payload = JSON.parse(node.getAttribute("data-payload"));

    if (!window.opener) {
      node.textContent = "This page has to be opened by the CMS, not visited directly.";
      return;
    }

    function onMessage(event) {
      // Only ever hand the token back to this same site.
      if (event.origin !== window.location.origin) return;
      window.opener.postMessage(payload, event.origin);
      window.removeEventListener("message", onMessage, false);
      node.textContent = "Done. You can close this window.";
    }

    window.addEventListener("message", onMessage, false);
    // Announce readiness; the CMS answers, which gives us its origin.
    window.opener.postMessage("authorizing:github", window.location.origin);
  })();
</script>
</body></html>`;
}

function html(body: string, status = 200) {
  return new NextResponse(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Never cache a response that carries a token.
      "cache-control": "no-store",
    },
  });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;

  const fail = (reason: string) => html(popupPage("error", { message: reason }));

  const githubError =
    url.searchParams.get("error_description") ?? url.searchParams.get("error");
  if (githubError) return fail(`GitHub refused the sign-in: ${githubError}`);
  if (!code) return fail("GitHub did not send an authorization code.");
  if (!state || !expectedState || state !== expectedState) {
    return fail(
      "Sign-in state did not match. Start again from /admin in this browser.",
    );
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return fail(
      "GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET are not set on this deployment.",
    );
  }

  let token: string | undefined;
  try {
    const exchange = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          // Must match the redirect_uri sent in step 1 or GitHub rejects it.
          redirect_uri: `${url.origin}/api/callback`,
        }),
      },
    );

    const data = (await exchange.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (data.error) {
      return fail(
        `GitHub rejected the code: ${data.error_description ?? data.error}`,
      );
    }
    token = data.access_token;
  } catch (caught) {
    return fail(
      `Could not reach GitHub to exchange the code: ${
        caught instanceof Error ? caught.message : "unknown error"
      }`,
    );
  }

  if (!token) return fail("GitHub returned no access token.");

  const response = html(popupPage("success", { token, provider: "github" }));
  // The state has been used; do not leave it lying around.
  response.cookies.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
