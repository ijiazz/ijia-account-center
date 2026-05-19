import { getCookie, setCookie } from "hono/cookie";
import { REQUEST_AUTH_KEY } from "@ijia/account-dto";
import { HonoContext } from "@/common/context.ts";
import { createUserInfo } from "@/common/userInfo.ts";
import { getValidUserSampleInfoByUserId } from "@/sql/user.ts";
/**
 * 装饰后，会根据添加 userInfo 到 HonoContext 上
 */
export async function setUserInfo(ctx: HonoContext, next: () => Promise<void>): Promise<void | Response> {
  const userInfo = createUserInfo(getCookie(ctx, REQUEST_AUTH_KEY));
  ctx.set("userInfo", userInfo);
  await next();
  const accessToken = await userInfo.checkUpdateToken();
  if (accessToken.needDelete) {
    setCookie(ctx, REQUEST_AUTH_KEY, "", { maxAge: 0 });
  } else if (accessToken.needRefresh) {
    const userId = await userInfo.getUserId();
    await getValidUserSampleInfoByUserId(userId);
    const newToken = await userInfo.refreshToken();
    setCookie(ctx, REQUEST_AUTH_KEY, newToken.token, { maxAge: newToken.maxAge ?? undefined });
  }
}
