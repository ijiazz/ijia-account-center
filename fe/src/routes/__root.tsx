import { createRootRoute, Outlet } from "@tanstack/react-router";

import { removeLoading } from "@/common/router.tsx";
import { LayoutDirectionProvider } from "@/provider/LayoutDirectionProvider.tsx";

import { FetchQueryOptions, QueryClientProvider } from "@tanstack/react-query";
import { apiEvent, queryClient, VersionUpdateEvent } from "@/request/client.ts";
import { PageLoading, RouterProgress } from "@/components/page_state.tsx";
import { BUILD_TIME } from "@/common/env.ts";
import { ijiaSessionStorage } from "@/stores/session_store.ts";
import { AntdThemeProvider } from "@/provider/AntdProvider.tsx";
import { HoFetchProvider } from "@/provider/HoFetchProvider.tsx";
import { GlobalAlert } from "@/components/page_state/Alert.tsx";

export const Route = createRootRoute({
  beforeLoad(ctx) {
    removeLoading();
    checkVersion().then(
      (newVersion) => {
        if (!newVersion) return;
        const lastReloadTime = ijiaSessionStorage.lastReloadTime;
        if (lastReloadTime && Date.now() - lastReloadTime < 5 * 60 * 1000) {
          // 5分钟内已经重载过了，避免重复重载
          return;
        }

        ijiaSessionStorage.lastReloadTime = Date.now();
        console.info("检测到新版本，正在重载页面...");
        window.location.reload();
      },
      () => {},
    );
  },
  loader(ctx) {
    checkVersion().then(
      (newVersion) => {
        if (!newVersion) return;
        VersionUpdateEvent.version = newVersion.toISOString();
        apiEvent.dispatchEvent(new VersionUpdateEvent(VersionUpdateEvent.version));
      },
      () => {},
    );
  },
  staleTime: 60 * 60 * 1000, // 1小时检查一次版本
  component: () => {
    return (
      <QueryClientProvider client={queryClient}>
        <LayoutDirectionProvider>
          <RouteComponent />
          <RouterProgress />
        </LayoutDirectionProvider>
      </QueryClientProvider>
    );
  },
  pendingComponent: PageLoading,
});

type VersionResponse = {
  nextVersion: Date | null;
};
async function checkVersion() {
  const VERSION_QUERY_OPTION = {
    queryKey: ["app", "version"],
    queryFn: (): Promise<VersionResponse> =>
      fetch("/index.html").then((res) => {
        if (!res.ok) {
          throw new Error("版本检查失败");
        }
        const version = res.headers.get("last-modified") ?? null;
        return { nextVersion: version ? new Date(version) : null };
      }),
    staleTime: 10 * 60 * 1000, // 10分钟
  } satisfies FetchQueryOptions;

  const result = await queryClient.fetchQuery(VERSION_QUERY_OPTION);
  if (!result.nextVersion) return null;
  const newest = result.nextVersion.getTime();

  return BUILD_TIME.getTime() < newest ? result.nextVersion : null;
}

function RouteComponent() {
  return (
    <AntdThemeProvider fixedMode="light">
      <HoFetchProvider>
        <GlobalAlert>
          <Outlet />
        </GlobalAlert>
      </HoFetchProvider>
    </AntdThemeProvider>
  );
}
