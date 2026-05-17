import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "@/request/client.ts";
import { getCurrentAccountInfoQueryOption } from "@/request/passport.ts";
import { AccountInfo } from "@ijia/account-dto";

export const Route = createFileRoute("/security/")({
  async loader(): Promise<LoaderData> {
    const accountInfo = await queryClient.fetchQuery(getCurrentAccountInfoQueryOption());
    return { accountInfo };
  },
});

export type LoaderData = {
  accountInfo: AccountInfo;
};
