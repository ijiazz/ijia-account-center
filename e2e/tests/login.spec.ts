import { getAppURLFromRoute } from "@/fixtures/test.ts";

import { initAlice } from "@/utils/user.ts";
import { loginByEmail, loginByPassword } from "@/tests/_utils/login.ts";
import { LOGIN_REDIRECT_URL } from "./_utils/login_home.ts";
import { expect, test } from "@playwright/test";

test("学号加密码登录", async function ({ page }) {
  const user = await initAlice();
  await page.goto(getAppURLFromRoute("/login"));
  await loginByPassword(page, user.id.toString(), user.password);
  await expect(page, "登录后导航到首页").toHaveURL(getAppURLFromRoute(LOGIN_REDIRECT_URL), {});
});
test("邮箱加密码登录", async function ({ page }) {
  const user = await initAlice();
  await page.goto(getAppURLFromRoute("/login"));
  await loginByPassword(page, user.email, user.password);
  await expect(page, "登录后导航到首页").toHaveURL(getAppURLFromRoute(LOGIN_REDIRECT_URL), {});
});
test("邮箱验证码码登录", async function ({ page }) {
  const user = await initAlice();
  await page.goto(getAppURLFromRoute("/login"));
  await loginByEmail(page, user.email);
  await expect(page, "登录后导航到首页").toHaveURL(getAppURLFromRoute(LOGIN_REDIRECT_URL), {});
});
