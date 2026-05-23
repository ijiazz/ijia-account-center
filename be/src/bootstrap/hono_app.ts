import { Hono } from "hono";
import { RouteApplyOption } from "@/lib/route.ts";
import { errorHandler } from "@/middleware/error_handler.ts";
import { cors } from "hono/cors";

import { captchaRoutes, passportRoutes } from "@/routes/mod.ts";

import { setUserInfo } from "@/middleware/auth.ts";

export function createHonoApp() {
  const hono = createHono();

  const options: RouteApplyOption = {};

  passportRoutes.apply(hono, options);
  captchaRoutes.apply(hono, options);
  return hono;
}

export function createHono() {
  const hono = new Hono();
  hono.onError(errorHandler);
  hono.use(
    cors({
      origin: (origin, ctx) => {
        if (!origin) return null;

        const url = new URL(origin);
        const hostname = url.hostname;

        if (url.protocol !== "https:") return null;

        if (hostname === "localhost" || hostname === "ijiazz.cn" || hostname.endsWith(".ijiazz.cn")) {
          return origin;
        }

        return null;
      },
      credentials: true,
      maxAge: 1800,
    }),
  );
  hono.use(function (ctx, next) {
    ctx.header("Server", "Hono");
    return next();
  });
  hono.use(setUserInfo);
  return hono;
}
