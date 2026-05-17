import { getAppURLFromRoute } from "@/utils/app.ts";
import { LOGIN_REDIRECT_URL, loginByPassword } from "./_utils/login.ts";
import { getUniqueEmail, initAlice, loginGetToken } from "@/utils/user.ts";
import { setContextLogin } from "@/utils/browser.ts";
import { expect, test } from "@playwright/test";

test("修改密码", async function ({ page, context }) {
  const Alice = await initAlice();
  const token = await loginGetToken(Alice.email, Alice.password);
  const aliceNewPassword = "aliceNew";
  await setContextLogin(context, token);
  await page.goto(getAppURLFromRoute("/security"));
  await page.locator("body").click();
  await page.getByRole("textbox", { name: "* 旧密码" }).click();
  await page.getByRole("textbox", { name: "* 旧密码" }).fill(Alice.password + "err");
  await page.getByRole("textbox", { name: "* 新密码" }).click();
  await page.getByRole("textbox", { name: "* 新密码" }).fill(aliceNewPassword);
  await page.getByRole("textbox", { name: "* 确认密码" }).click();
  await page.getByRole("textbox", { name: "* 确认密码" }).fill(aliceNewPassword);
  await page.getByRole("button", { name: "确认修改" }).click();

  await page.getByRole("textbox", { name: "* 旧密码" }).click();
  await page.getByRole("textbox", { name: "* 旧密码" }).fill(Alice.password);
  await page.getByRole("button", { name: "确认修改" }).click();

  await page.goto(getAppURLFromRoute("/login"));

  await loginByPassword(page, Alice.email, aliceNewPassword);
  await expect(page, "登录后导航到首页").toHaveURL(getAppURLFromRoute(LOGIN_REDIRECT_URL), {});
});

test("修改邮箱", async function ({ page, context }) {
  const Alice = await initAlice();
  const token = await loginGetToken(Alice.email, Alice.password);
  await setContextLogin(context, token);
  const changeEmail = await getUniqueEmail();

  await page.goto(getAppURLFromRoute("/security"));

  await page.getByRole("button", { name: "修 改" }).click();

  await page.getByRole("button", { name: "发送验证码" }).click();
  await page.locator(".captcha-img").first().click();
  await page.locator("div:nth-child(2) > .captcha-img").click();
  await page.locator("div:nth-child(3) > .captcha-img").click();

  await page.getByRole("button", { name: "确 定" }).click();
  await page.getByRole("textbox", { name: "* 验证码 :" }).fill("1234");
  await new Promise((r) => setTimeout(r, 500));
  await page.getByRole("button", { name: "下一步" }).click();
  await page.getByRole("textbox", { name: "* 新邮箱 :" }).fill(changeEmail);

  await page.getByRole("button", { name: "发送验证码" }).click();
  await page.locator(".captcha-img").first().click();
  await page.locator("div:nth-child(2) > .captcha-img").click();
  await page.locator("div:nth-child(3) > .captcha-img").click();

  await page.getByRole("button", { name: "确 定" }).click();
  await page.getByRole("textbox", { name: "* 验证码 :" }).fill("1234");
  await new Promise((r) => setTimeout(r, 500));
  await page.getByRole("button", { name: "确 认" }).click();

  await expect(page.locator(".e2e-current-user"), "断言输入框的值为修改后的邮箱").toHaveValue(changeEmail);
});
