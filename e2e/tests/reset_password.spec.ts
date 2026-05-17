import { getAppURLFromRoute } from "@/utils/app.ts";
import { LOGIN_REDIRECT_URL, loginByPassword } from "./_utils/login.ts";
import { initAlice } from "@/utils/user.ts";
import { expect, test } from "@playwright/test";

test("重置密码", async function ({ page }) {
  const Alice = await initAlice();
  await page.goto(getAppURLFromRoute("/login"));
  await page.getByRole("link", { name: "忘记密码" }).click();

  await page.getByRole("textbox", { name: "* 电子邮箱 :" }).fill(Alice.email);
  await page.getByRole("button", { name: "发送验证码" }).click();
  await page.locator(".captcha-img").first().click();
  await page.locator("div:nth-child(2) > .captcha-img").click();
  await page.locator("div:nth-child(3) > .captcha-img").click();
  await page.getByRole("button", { name: "确 定" }).click();
  await page.getByRole("textbox", { name: "* 邮件验证码 :" }).fill("1234");
  await page.getByRole("textbox", { name: "* 新密码 :" }).fill("new");
  await page.getByRole("textbox", { name: "* 确认密码 :" }).fill("new");
  await page.getByRole("button", { name: "确 认" }).click();
  await page.locator(".e2e-go-to-login").click();

  await loginByPassword(page, Alice.email, "new");
  await expect(page, "使用新密码成功登录").toHaveURL(getAppURLFromRoute(LOGIN_REDIRECT_URL));
});
