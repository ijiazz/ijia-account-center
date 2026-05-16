import { HonoContext } from "@/common/context.ts";
import { getCookie, setCookie } from "hono/cookie";
import { UserInfo } from "./userInfo.ts";
import { REQUEST_AUTH_KEY } from "@ijia/account-dto";
/**
 * 装饰后，会根据添加 userInfo 到 HonoContext 上
 */
export async function setUserInfo(ctx: HonoContext, next: () => Promise<void>): Promise<void | Response> {
  const userInfo = new UserInfo(getCookie(ctx, REQUEST_AUTH_KEY));
  ctx.set("userInfo", userInfo);
  await next();
  const accessToken = await userInfo.checkUpdateToken();
  if (accessToken) {
    setCookie(ctx, REQUEST_AUTH_KEY, accessToken.token, { maxAge: accessToken.maxAge ?? undefined });
  }
}
