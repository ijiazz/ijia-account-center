import { QueryClient } from "@tanstack/react-query";
import { createFetchSuite, FetchSuiteBase, HoFetch, InferFetchSuite } from "@asla/hofetch";
import { ApiDefined } from "@ijia/account-dto";
import { alert, errorHandler } from "./client/_middleware.ts";
import { API_HOST } from "@/common/host.ts";

export * from "./client/event.ts";
export * from "./client/util.ts";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      networkMode: "always",
    },
    mutations: {
      retry: false,
      networkMode: "always",
    },
  },
});
type API = {
  [x: string]: FetchSuiteBase;
} & InferFetchSuite<ApiDefined>;

export const http = new HoFetch({ fetch: (url, option) => fetch(url, { ...option, credentials: "include" }) });
export const api: API = createFetchSuite<ApiDefined>(http, {
  basePath: API_HOST.pathname,
  origin: API_HOST.origin,
});

http.use(errorHandler);
http.use(alert);
