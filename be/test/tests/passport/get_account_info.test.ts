import { beforeEach, expect } from "vitest";
import { Api, Context, JWT_TOKEN_KEY, test } from "#test/fixtures/hono.ts";
import passportRoutes from "@/routes/passport.ts";
import { prepareUniqueUser } from "#test/utils/user.ts";
import { AccountInfo } from "@ijia/account-dto";

beforeEach<Context>(async ({ hono }) => {
  passportRoutes.apply(hono);
});
test("获取用户信息", async function ({ api, publicDbPool }) {
  const alice = await prepareUniqueUser("alice");

  await expect(apiGetAccountInfo(api, { token: alice.token })).resolves.toMatchObject(
    {
      user_id: alice.id.toString(),
      email: alice.email,
      nickname: alice.nickname,
    } satisfies Partial<AccountInfo>,
  );
});
test("没有登录不能获取用户信息", async function ({ api, publicDbPool }) {
  await expect(apiGetAccountInfo(api)).responseStatus(401);
});

function apiGetAccountInfo(api: Api, param: { token?: string } = {}) {
  return api["/passport/account"].get({ [JWT_TOKEN_KEY]: param.token });
}
