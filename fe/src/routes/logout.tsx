import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "@/request/client.ts";

export const Route = createFileRoute("/logout")({
  async beforeLoad() {
    try {
      await api["/passport/logout"].post();
    } catch (e) {
      globalThis.history.back();
      return;
    }
    throw redirect({ to: "/login" });
  },
});
