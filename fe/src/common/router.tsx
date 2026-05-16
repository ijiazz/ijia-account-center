import React from "react";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen.ts";
import { ErrorPage, NotFoundPage, PageLoading } from "@/components/page_state.tsx";

export function genRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: ({ error, reset, info }) => (
      <ErrorPage error={error} reset={reset} info={info?.componentStack} />
    ),
    defaultPendingComponent: PageLoading,
    defaultNotFoundComponent: NotFoundPage,
    defaultViewTransition: true,
    defaultGcTime: 0,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof genRouter>;
  }
}
export const router = genRouter();

export function SsrRootWarp(props: React.PropsWithChildren) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>IJIA学院</title>
        <meta name="description" content="我要成为IJIA高手！" />
        <meta name="keywords" content="IJIA学院,爱佳学院" />
        <meta name="author" content="IJIA学院" />
        <meta name="Robots" content="noindex" />
        <link rel="canonical" href="https://ijiazz.cn/" />
        <style>
          {`
          html,
          body {
            padding: 0;
            margin: 0;
            height: 100%;
          }
        `}
        </style>
      </head>
      <body>{props.children}</body>
    </html>
  );
}

export function getUrlByRoute(route: string) {
  return location.origin + getPathByRoute(route);
}
export function getPathByRoute(route: string) {
  if (!route.startsWith("/")) throw new Error("router must start with /");
  const base = import.meta.env?.BASE_URL ?? "/";
  if (base.endsWith("/")) return base + route.slice(1);
  return route;
}

export function removeLoading() {
  const element = document.getElementById("app-loading");
  if (element) {
    element.remove();
  }
}

export const ROUTES = {
  Login: "/login",
  SignupRedirect: "/signup-redirect",
  LoginRedirect: "/",
} as const;

export function goRedirectLoginPath() {
  const url = new URL(location.href);
  const target = url.pathname + url.search + url.hash;
  const isLoginPage = location.href.startsWith(getUrlByRoute(ROUTES.Login));
  if (!isLoginPage) {
    const s = new URLSearchParams();
    s.set("redirect", target);
    return ROUTES.Login + "?" + s.toString();
  }
}
