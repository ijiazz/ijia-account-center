import { beforeEach, expect } from "vitest";
import { Api, Context, JWT_TOKEN_KEY, test } from "#test/fixtures/hono.ts";
import passportRoutes from "@/routes/passport.ts";
import captchaRoutes from "@/routes/captcha.ts";

import { initCaptcha } from "#test/__mocks__/captcha.ts";
import { getValidUserSampleInfoByUserId } from "@/sql/user.ts";
import { createUser } from "@/routes/passport/-sql/signup.ts";

import { getUniqueEmail, getUniqueName, prepareUniqueUser } from "#test/utils/user.ts";
import { update } from "@asla/yoursql";
import { EmailCaptchaActionType } from "@ijia/account-dto";
import { mockSendEmailCaptcha, mockSendSelfEmailCaptcha } from "./_mocks/captcha.ts";

beforeEach<Context>(async ({ hono, publicDbPool }) => {
  await initCaptcha();
  passportRoutes.apply(hono);
  captchaRoutes.apply(hono);
});

test("修改邮箱", async function ({ api, publicDbPool }) {
  const alice = await prepareUniqueUser("alice");
  const accountToken = await getAccountToken(api, alice.token);

  const newEmail = await getUniqueEmail("news");
  const emailCaptchaAnswer = await mockSendEmailCaptcha(api, newEmail, EmailCaptchaActionType.changeEmail);
  await api["/passport/change_email"].post({
    body: { newEmail: newEmail, emailCaptcha: emailCaptchaAnswer, accountToken },
    [JWT_TOKEN_KEY]: alice.token,
  });
  await expect(getUserEmail(alice.id), "成功修改邮箱").resolves.toBe(newEmail);
});
test("不能使用 news 的验证码来验证 bob 的邮箱", async function ({ api, publicDbPool }) {
  const alice = await prepareUniqueUser("alice");
  const accountToken = await getAccountToken(api, alice.token);
  const newEmail = await getUniqueEmail("news");
  const bobEmail = await getUniqueEmail("bob");
  const emailCaptchaAnswer = await mockSendEmailCaptcha(api, newEmail, EmailCaptchaActionType.changeEmail);
  const promise = api["/passport/change_email"].post({
    body: { newEmail: bobEmail, emailCaptcha: emailCaptchaAnswer, accountToken },
    [JWT_TOKEN_KEY]: alice.token,
  });
  await expect(promise).responseStatus(418);
});
test("邮箱已被注册，尝试修改发送将无法发送验证码", async function ({ api, publicDbPool }) {
  const alice = await prepareUniqueUser("alice");
  const bob = await prepareUniqueUser("bob");
  await expect(mockSendEmailCaptcha(api, alice.email, EmailCaptchaActionType.changeEmail), "邮箱已被注册")
    .responseStatus(406);
});
test("邮箱不能修改成已注册的邮箱", async function ({ api, publicDbPool }) {
  const alice = await prepareUniqueUser("alice");
  const accountToken = await getAccountToken(api, alice.token);

  const BobEmail = "bob@ijiazz.cn";

  const emailCaptchaAnswer = await mockSendEmailCaptcha(api, BobEmail, EmailCaptchaActionType.changeEmail);

  // 获取验证码后立即抢注一个账号
  const newsId = await createUser(BobEmail, { password: alice.email });
  await expect(
    api["/passport/change_email"].post({
      body: { newEmail: BobEmail, emailCaptcha: emailCaptchaAnswer, accountToken },
      [JWT_TOKEN_KEY]: alice.token,
    }),
  ).responseStatus(409);
});
test("修改的邮箱大写字母域名会被转换成小写", async function ({ api, publicDbPool }) {
  const alice = await prepareUniqueUser("alice");
  const accountToken = await getAccountToken(api, alice.token);

  const prefix = await getUniqueName("Abc1");
  const newEmail = `${prefix}@IJIAzz.中文`;

  const emailCaptchaAnswer = await mockSendEmailCaptcha(api, newEmail, EmailCaptchaActionType.changeEmail);
  await api["/passport/change_email"].post({
    body: { newEmail: newEmail, emailCaptcha: emailCaptchaAnswer, accountToken },
    [JWT_TOKEN_KEY]: alice.token,
  });
  await expect(getUserEmail(alice.id), "成功修改邮箱变为小写").resolves.toBe(`${prefix.toLowerCase()}@ijiazz.中文`);
});
test("已注销账号不能修改邮箱", async function ({ api, publicDbPool }) {
  const alice = await prepareUniqueUser("alice");
  const accountToken = await getAccountToken(api, alice.token);
  await publicDbPool.execute(update("public.user").set({ is_deleted: "true" }).where(`id=${alice.id}`));
  const newEmail = "news@ijiazz.cn";
  const emailCaptchaAnswer = await mockSendEmailCaptcha(api, newEmail, EmailCaptchaActionType.changeEmail);
  const promise = api["/passport/change_email"].post({
    body: { newEmail: newEmail, emailCaptcha: emailCaptchaAnswer, accountToken },
    [JWT_TOKEN_KEY]: alice.token,
  });
  await expect(promise).responseStatus(423);
});

function getUserEmail(id: number) {
  return getValidUserSampleInfoByUserId(id).then((res) => res.email);
}

async function getAccountToken(api: Api, userToken: string) {
  const emailAnswer = await mockSendSelfEmailCaptcha(api, userToken, EmailCaptchaActionType.signAccountToken);
  const res = await api["/passport/sign_account_token"].post({
    body: { emailCaptcha: emailAnswer },
    [JWT_TOKEN_KEY]: userToken,
  });
  return res.account_token;
}
