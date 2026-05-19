import { Context } from "hono";
import { UserInfo } from "@/common/userInfo.ts";

type HonoVariables = {
  userInfo: UserInfo;
};
export type HonoContext = Context<{ Variables: HonoVariables }>;
