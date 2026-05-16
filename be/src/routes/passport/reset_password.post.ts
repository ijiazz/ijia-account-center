import { EmailCaptchaActionType, ResetPasswordParam } from "@ijia/account-dto";
import { optional } from "@asla/wokao";
import { hashPasswordFrontEnd } from "./-services/password.ts";
import { checkValueAsync } from "@/common/check.ts";
import { emailCaptchaReplyChecker, emailCaptchaService } from "@/routes/captcha.ts";
import { HttpError } from "@/common/errors.ts";
import { resetAccountPassword } from "./-sql/account.ts";
import routeGroup from "./_route.ts";

export default routeGroup.create({
  method: "POST",
  routePath: "/passport/reset_password",
  async validateInput(ctx) {
    const param = await checkValueAsync(ctx.req.json(), {
      email: "string",
      emailCaptcha: emailCaptchaReplyChecker(),

      newPassword: "string",
      passwordNoHash: optional.boolean,
    });
    if (param.passwordNoHash) param.newPassword = await hashPasswordFrontEnd(param.newPassword);

    return param;
  },
  async handler(body: ResetPasswordParam): Promise<void> {
    const pass = await emailCaptchaService.verify(body.emailCaptcha, body.email, EmailCaptchaActionType.resetPassword);
    if (!pass) throw new HttpError(409, "验证码错误");
    await resetAccountPassword(body.email, body.newPassword);
  },
});
