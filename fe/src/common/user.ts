import { queryClient } from "@/request/client.ts";
import { ijiaCookie } from "@/stores/cookie.ts";

export function loginByAccessToken(accessToken: string) {
  ijiaCookie.accessToken = accessToken;
}

export function clearUserCache() {
  queryClient.clear();
}
