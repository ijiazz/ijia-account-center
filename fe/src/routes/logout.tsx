import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "@/request/client.ts";

export const Route = createFileRoute("/logout")({
  async beforeLoad(ctx) {
    try {
      await api["/passport/logout"].post();
    } catch (e) {
      if (globalThis.history.length > 1) {
        globalThis.history.back();
        throw redirect({ to: "/login", search: ctx.search });
      }
      return;
    }
    throw redirect({ to: "/login", search: ctx.search });
  },
  validateSearch(value): { redirect?: string } {
    return value;
  },
});
