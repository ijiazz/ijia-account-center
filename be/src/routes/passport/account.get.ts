import { AccountInfo } from "@ijia/account-dto";
import routeGroup from "./_route.ts";
import { getUserInfo } from "@/routes/passport/-sql/account.ts";
import { HttpError } from "@/common/errors.ts";

export default routeGroup.create({
  method: "GET",
  routePath: "/passport/account",
  validateInput(ctx) {
    const userInfo = ctx.get("userInfo");
    const userId = userInfo.getUserId();
    return userId;
  },
  async handler(userId): Promise<AccountInfo> {
    const info = await getUserInfo(userId);
    if (!info) {
      throw new HttpError(404, { message: "用户不存在" });
    }
    return info;
  },
});
