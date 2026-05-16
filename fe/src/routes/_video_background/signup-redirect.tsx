import { createFileRoute, redirect } from "@tanstack/react-router";
import { IS_ONLINE_HOSTNAME } from "@/common/env.ts";
import { SIGNUP_REDIRECT_URL } from "@/common/host.ts";

export const Route = createFileRoute("/_video_background/signup-redirect")({
  beforeLoad(ctx) {
    if (IS_ONLINE_HOSTNAME) {
      throw redirect({ href: SIGNUP_REDIRECT_URL });
    }
  },
  component: () => {
    return `这个页面在生产环境会被重定向到 ${SIGNUP_REDIRECT_URL}，仅在非生产环境显示这个文本，用于E2E断言`;
  },
});
