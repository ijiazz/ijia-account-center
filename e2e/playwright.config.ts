import { defineConfig } from "@playwright/test";
import process from "node:process";
import path from "node:path";

const USE_PREVIEW = false;

export const env = {
  WEB_URL: process.env.WEB_URL || "http://localhost:5173",
  DATABASE_URL: process.env.DATABASE_URL || "pg://postgres@localhost:5432/ijia_test",
  API_ORIGIN: process.env.API_ORIGIN || "http://127.0.0.1:3000",
};

const WEB_DIR = path.resolve("../web");

export default defineConfig({
  testDir: ".",
  workers: 3,
  use: {
    browserName: "chromium",
    actionTimeout: 5000,
    navigationTimeout: 10000,
  },
  webServer: USE_PREVIEW
    ? {
      command: "deno task preview",
      env: {
        API_ORIGIN: env.API_ORIGIN,
      },
      cwd: WEB_DIR,
      url: env.WEB_URL,
    }
    : undefined,

  outputDir: "temp",
  timeout: 20000,
  expect: {
    timeout: 5000, // 设置全局断言超时时间为5秒
  },
  globalSetup: ["./setup/setup.ts"],
  testIgnore: [/benchmark/],
});
