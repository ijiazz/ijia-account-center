import { checkTypeCopy, enumType, integer, optional } from "@asla/wokao";
import { checkValue, emailChecker } from "@/common/check.ts";
import { imageCaptchaReplyChecker } from "@/routes/captcha.ts";

export function checkUserParam(unsafeParam: unknown) {
  return checkValue(unsafeParam, {
    user: (value) => {
      if (typeof value !== "object" || value === null) {
        throw new Error("用户标识不合法");
      }
      const target = checkTypeCopy((value as any).type, enumType<"userId" | "email">(["userId", "email"]));
      switch (target) {
        case "email": {
          return checkTypeCopy((value as { email: string }).email, emailChecker);
        }
        case "userId": {
          return checkTypeCopy((value as { userId: string }).userId, integer());
        }
        default:
          throw new Error("用户标识不合法");
      }
    },
    password: optional.string,
    passwordNoHash: optional.boolean,
    captcha: optional(imageCaptchaReplyChecker()),
  });
}
