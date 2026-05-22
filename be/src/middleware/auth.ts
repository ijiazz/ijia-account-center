import { getCookie } from "hono/cookie";
import { REQUEST_AUTH_KEY } from "@ijia/account-dto";
import { HonoContext } from "@/common/context.ts";
import { createUserInfo } from "@/common/userInfo.ts";
/**
 * 装饰后，会根据添加 userInfo 到 HonoContext 上
 */
export async function setUserInfo(ctx: HonoContext, next: () => Promise<void>): Promise<void | Response> {
  const userInfo = createUserInfo(getCookie(ctx, REQUEST_AUTH_KEY));
  ctx.set("userInfo", userInfo);
  await next();
  const accessToken = await userInfo.checkUpdateToken();
  if (accessToken.needDelete) {
    // 跳过删除已过期 token 的步骤
  } else if (accessToken.needRefresh) {
    ctx.header("X-Token-Need-Refresh", "true");
  }
}
