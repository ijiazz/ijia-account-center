import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "@/request/client.ts";

export const Route = createFileRoute("/logout")({
  async beforeLoad(ctx) {
    await api["/passport/logout"].post();
    throw redirect({ to: "/login", search: ctx.search });
  },
  validateSearch(value): { redirect?: string } {
    return value;
  },
});
