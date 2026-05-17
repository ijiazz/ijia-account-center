import { QueryOptions } from "@tanstack/react-query";
import { api, IGNORE_UNAUTHORIZED_REDIRECT } from "./client.ts";
import { AccountInfo } from "@ijia/account-dto";
import { ijiaLocalStorage } from "@/stores/local_store.ts";

export const USER_QUERY_KEY_PREFIX = "user";

export type GetCurrentAccountInfoOption = {
  ignoreUnAuthorizeRedirect?: boolean;
};
export function getCurrentAccountInfoQueryOption(option: GetCurrentAccountInfoOption = {}) {
  return {
    queryKey: [USER_QUERY_KEY_PREFIX, "currentUser"],
    queryFn: async (): Promise<AccountInfo> => {
      const res = await api["/passport/account"].get({
        [IGNORE_UNAUTHORIZED_REDIRECT]: option.ignoreUnAuthorizeRedirect,
      });
      try {
        if (ijiaLocalStorage.unverifiedUserId !== res.user_id.toString()) {
          ijiaLocalStorage.unverifiedUserId = res.user_id.toString();
        }
      } catch (e) {
        console.error("设置用户信息失败", e);
      }
      return res;
    },
  } satisfies QueryOptions;
}
