import routeGroup from "./_route.ts";
import { setCookieAuth } from "./-services/cookie.ts";

export default routeGroup.create({
  method: "POST",
  routePath: "/passport/refresh_token",
  async handler(param: undefined, ctx): Promise<void> {
    const userInfo = ctx.get("userInfo");
    await userInfo.getValidUserSampleInfo(); // 验证用户是否有效
    const result = await userInfo.refreshToken();
    setCookieAuth(ctx, result.token, result.maxAge);
  },
});
