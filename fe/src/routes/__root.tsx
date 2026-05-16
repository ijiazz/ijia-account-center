import { createRootRoute, Outlet } from "@tanstack/react-router";

import { removeLoading } from "@/common/router.tsx";
import { LayoutDirectionProvider } from "@/provider/LayoutDirectionProvider.tsx";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/request/client.ts";
import { PageLoading, RouterProgress } from "@/components/page_state.tsx";
import { AntdThemeProvider } from "@/provider/AntdProvider.tsx";
import { HoFetchProvider } from "@/provider/HoFetchProvider.tsx";
import { GlobalAlert } from "@/components/page_state/Alert.tsx";

export const Route = createRootRoute({
  beforeLoad(ctx) {
    removeLoading();
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
