import { beforeEach, expect } from "vitest";
import { Api, Context, JWT_TOKEN_KEY, test } from "#test/fixtures/hono.ts";
import passportRoutes from "@/routes/passport.ts";
import captchaRoutes from "@/routes/captcha.ts";

import { createCaptchaSession, initCaptcha } from "#test/__mocks__/captcha.ts";
import { hashPasswordFrontEnd } from "@/routes/passport/-services/password.ts";

import { prepareUniqueUser } from "#test/utils/user.ts";
import { LoginMethod, UserIdentifierType } from "@ijia/account-dto";

beforeEach<Context>(async ({ hono, publicDbPool }) => {
  await initCaptcha();
  passportRoutes.apply(hono);
  captchaRoutes.apply(hono);
});

test("修改密码", async ({ api, publicDbPool }) => {
  const pwd = await hashPasswordFrontEnd("newPassword123");
  const alice = await prepareUniqueUser("alice", { password: pwd });
  const newPassword = await hashPasswordFrontEnd("newPassword123");
  await api["/passport/change_password"].post({
    body: { oldPassword: pwd, newPassword: newPassword },
    [JWT_TOKEN_KEY]: alice.token,
  });
  await expect(aliceLoin(api, alice.email, newPassword), "新密码登录成功").resolves.toBeTypeOf("object");
  await expect(aliceLoin(api, alice.email, alice.email), "旧密码登录失败").responseStatus(401);
});
test("修改密码必须输入正确的旧密码", async ({ api, publicDbPool }) => {
  const alice = await prepareUniqueUser("alice");
  const newPassword = await hashPasswordFrontEnd("newPassword123");
  const promise = api["/passport/change_password"].post({
    body: { oldPassword: await hashPasswordFrontEnd("errorPassword"), newPassword: newPassword },
    [JWT_TOKEN_KEY]: alice.token,
  });
  await expect(promise, "旧密码错误").responseStatus(401);
});

async function aliceLoin(api: Api, email: string, password: string) {
  const captcha = await createCaptchaSession();
  return api["/passport/login"].post({
    body: {
      user: { email: email, type: UserIdentifierType.email },
      method: LoginMethod.password,
      password: password,
      captcha,
    },
  });
}
