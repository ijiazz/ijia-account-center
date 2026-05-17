import { appConfig, ENV, RunMode } from "@/config.ts";
import { REQUEST_AUTH_KEY } from "@ijia/account-dto";
import { Context } from "hono";
import { setCookie } from "hono/cookie";

export function setCookieAuth(ctx: Context, value: string, maxAge: number | null): void {
  const requestURL = new URL(ctx.req.url);
  const configHost = appConfig.passport?.host;
  let domain: string | undefined = undefined;
  if (configHost && requestURL.hostname.endsWith(configHost)) {
    domain = `.${configHost}`;
  }
  setCookie(ctx, REQUEST_AUTH_KEY, value, {
    domain: domain,
    maxAge: maxAge ?? undefined,
    sameSite: "Lax",
    secure: ENV.MODE === RunMode.Prod,
    httpOnly: true,
    path: "/",
  });
}
