import { AuthTokenType, signAccessToken } from "@/common/jwt.ts";
import { HonoContext } from "@/common/context.ts";
import { RouteGroup } from "@/lib/route.ts";

const routeGroup = new RouteGroup<HonoContext>();
export default routeGroup;

export async function signToken(userId: number) {
  const DAY = 24 * 60 * 60; // 一天的秒数

  const jwtKey = await signAccessToken({ userId, type: AuthTokenType.User }, {
    survivalSeconds: 20 * 60, // 20 分钟过期. 每20分钟需要刷新一次
    refreshKeepAliveSeconds: 1 * DAY, // 1 天内可刷新 TOKEN
    refreshSurvivalSeconds: 7 * DAY, // 刷新 token 最多可以用 7 天
  });

  // token 最短有效期为 1天20分钟
  return jwtKey;
}
