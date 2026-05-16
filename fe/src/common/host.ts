import { IS_ONLINE_HOSTNAME } from "@/common/env.ts";

const IJIA_ORIGIN = "https://ijiazz.cn";

export const IJIA_HOME_URL: string = IJIA_ORIGIN;
export const SIGNIN_REDIRECT_URL: string = `${IJIA_ORIGIN}/wall`;
export const SIGNUP_REDIRECT_URL: string = `${IJIA_ORIGIN}/profile/center`;

export const API_HOST: URL = IS_ONLINE_HOSTNAME
  ? new URL("https://ijiazz.cn/api")
  : new URL("/api", globalThis.location.origin);
