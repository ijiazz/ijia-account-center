import { createFileRoute, redirect } from "@tanstack/react-router";
import { setDocumentTitle } from "@/hooks/document_title.ts";
import { api } from "@/request/client.ts";

export const Route = createFileRoute("/logout")({
  async beforeLoad(ctx) {
    setDocumentTitle("退出登录 - IJIA学院");
    await api["/passport/logout"].post();
    throw redirect({ to: "/login", search: ctx.search });
  },
  validateSearch(value): { redirect?: string } {
    return value;
  },
});
