import { Page } from "@playwright/test";
import process from "node:process";
import { dbPool } from "@/db/client.ts";
import { env } from "@/playwright.config.ts";
import { DbQueryPool } from "@asla/pg";

export interface Context {
  dbPool: DbQueryPool;
  appPage: Page;
  webInfo: typeof env;
}
if (!process.env.DATABASE_URL) dbPool.connectOption = env.DATABASE_URL;

export function getAppURLFromRoute(
  route: string,
  search?: { [key: string]: string | number | boolean | undefined },
): string {
  if (!route.startsWith("/")) throw new Error("router must start with /");
  if (route === "/") return env.WEB_URL;
  const url = new URL(env.WEB_URL + route);
  if (search) {
    for (const [key, value] of Object.entries(search)) {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    }
  }
  return url.toString();
}
