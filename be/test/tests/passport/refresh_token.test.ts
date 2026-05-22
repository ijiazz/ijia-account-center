import { beforeEach, expect } from "vitest";
import { Context, test } from "#test/fixtures/hono.ts";
import passportRoutes from "@/routes/passport.ts";
import { verifyAccessToken } from "@/common/jwt.ts";
import { REQUEST_AUTH_KEY } from "@ijia/account-dto";
import { prepareUniqueUser } from "#test/utils/user.ts";

beforeEach<Context>(async ({ hono }) => {
	passportRoutes.apply(hono);
});

test("没有登录不能刷新 token", async ({ hono }) => {
	const response = await refreshToken(hono);
	expect(response.status).toBe(401);
});

test("登录后刷新 token 会重新写入鉴权 cookie", async ({ hono }) => {
	const alice = await prepareUniqueUser("alice");

	const response = await refreshToken(hono, alice.token);
	expect(response.status).toBe(200);

	const setCookie = response.headers.get("set-cookie");
	expect(setCookie).toContain(`${REQUEST_AUTH_KEY}=`);

	const token = extractCookieValue(setCookie, REQUEST_AUTH_KEY);
	const nextToken = await verifyAccessToken(token);

	expect(nextToken.data.userId).toBe(alice.id);
});

async function refreshToken(hono: Context["hono"], token?: string) {
	const headers = new Headers();
	if (token) {
		headers.set("cookie", `${REQUEST_AUTH_KEY}=${token}`);
	}

	return hono.fetch(
		new Request("http://127.0.0.1/passport/refresh_token", {
			method: "POST",
			headers,
		}),
	);
}

function extractCookieValue(setCookie: string | null, key: string) {
	expect(setCookie).toBeTruthy();
	const match = setCookie?.match(new RegExp(`${key}=([^;]+)`));
	expect(match?.[1]).toBeTruthy();
	return match![1];
}
