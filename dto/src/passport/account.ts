import type { EmailCaptchaReply } from "../captcha.ts";

export type GetAccountAuthTokenParam = {
  emailCaptcha: EmailCaptchaReply;
};

export type AccountAuthenticateToken = {
  account_token: string;
};
export type ChangeEmailParam = {
  newEmail: string;
  accountToken: string;
  /** 新邮箱的验证码 */
  emailCaptcha: EmailCaptchaReply;
};
export interface AccountInfo {
  user_id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
}
