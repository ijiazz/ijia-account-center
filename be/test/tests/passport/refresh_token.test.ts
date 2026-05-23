import { beforeEach, expect } from "vitest";
import { Context, JWT_TOKEN_KEY, test } from "#test/fixtures/hono.ts";
import passportRoutes from "@/routes/passport.ts";
import { verifyAccessToken } from "@/common/jwt.ts";
import { REQUEST_AUTH_KEY } from "@ijia/account-dto";
import { prepareUniqueUser } from "#test/utils/user.ts";

beforeEach<Context>(async ({ hono }) => {
  passportRoutes.apply(hono);
});

test("没有登录不能刷新 token", async ({ api }) => {
  await expect(refreshToken(api)).responseStatus(401);
});

test("登录后刷新 token 会重新写入鉴权 cookie", async ({ api, publicDbPool }) => {
  const alice = await prepareUniqueUser("alice");

  const response = await refreshToken(api, alice.token);
  await expect(response).responseStatus(200);

  const setCookie = response.headers.getSetCookie();
  expect(setCookie[0]).toContain(`${REQUEST_AUTH_KEY}=`);

  const token = extractCookieValue(setCookie, REQUEST_AUTH_KEY);
  const nextToken = await verifyAccessToken(token);

  expect(nextToken.data.userId).toBe(alice.id);
});

async function refreshToken(api: Context["api"], token?: string) {
  return api["/passport/refresh_token"].fetch({
    [JWT_TOKEN_KEY]: token,
    method: "POST",
  });
}

function extractCookieValue(setCookie: string[] | null, key: string) {
  expect(setCookie).toBeTruthy();
  const match = setCookie?.[0].match(new RegExp(`${key}=([^;]+)`));
  expect(match?.[1]).toBeTruthy();
  return match![1];
}
