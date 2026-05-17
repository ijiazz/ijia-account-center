import { beforeEach, expect } from "vitest";
import { Context, JWT_TOKEN_KEY, test } from "#test/fixtures/hono.ts";
import passportRoutes from "@/routes/passport.ts";
import captchaRoutes from "@/routes/captcha.ts";

import { initCaptcha } from "#test/__mocks__/captcha.ts";

import { prepareUniqueUser } from "#test/utils/user.ts";
import { EmailCaptchaActionType } from "@ijia/account-dto";
import { mockSendSelfEmailCaptcha } from "./_mocks/captcha.ts";

beforeEach<Context>(async ({ hono, publicDbPool }) => {
  await initCaptcha();
  passportRoutes.apply(hono);
  captchaRoutes.apply(hono);
});

test("获取账号authToken", async function ({ api, publicDbPool }) {
  const alice = await prepareUniqueUser("alice");
  const emailCaptchaAnswer = await mockSendSelfEmailCaptcha(api, alice.token, EmailCaptchaActionType.signAccountToken);
  const result = await api["/passport/sign_account_token"].post({
    body: { emailCaptcha: emailCaptchaAnswer },
    [JWT_TOKEN_KEY]: alice.token,
  });
  expect(result).toHaveProperty("account_token");
});
test("没有登录不能获取账号authToken", async function ({ api, publicDbPool }) {
  const alice = await prepareUniqueUser("alice");
  const emailCaptchaAnswer = mockSendSelfEmailCaptcha(api, "", EmailCaptchaActionType.signAccountToken);
  await expect(emailCaptchaAnswer).responseStatus(401);
});
