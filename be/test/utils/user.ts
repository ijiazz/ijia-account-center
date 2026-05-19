import { AuthTokenType, signAccessToken } from "@/common/jwt.ts";
import { getUniqueIdFormDb, newTestUser } from "@ijia/school-db/testlib";
import { Role } from "@/common/userInfo.ts";

/** 获取唯一名称 */
export async function getUniqueName(base: string) {
  const id = await getUniqueIdFormDb();
  return base + id;
}
/** 获取全局唯一邮箱，用于公共数据库时创建用户测试 */
export const getUniqueEmail = async (base: string) => {
  const id = await getUniqueName(base);
  return `${id}@ijiazz.cn`;
};

export async function prepareUniqueUser(nickname: string, option: PrepareUserOption = {}): Promise<UserToken> {
  const info = await newTestUser(nickname, option);
  const { token } = await signAccessToken({ type: AuthTokenType.User, userId: info.id }, {
    survivalSeconds: 60 * 100 * 60,
  });
  return {
    ...info,
    token,
  };
}
export type UserToken = {
  id: number;
  nickname: string;
  token: string;
  email: string;
  password?: string;
};

export type PrepareUserOption = {
  password?: string;
  roles?: Set<Role> | Role[]; // 角色
};
