import type { CaptchaApi } from "./captcha.ts";
import type { PassportApi } from "./passport.ts";

export interface ApiDefined extends PassportApi, CaptchaApi {}

export * from "./passport.ts";
export * from "./captcha.ts";
export * from "./common.ts";
