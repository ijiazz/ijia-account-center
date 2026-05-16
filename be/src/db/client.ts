import { PgDbQueryPool } from "@asla/pg";
import { ENV, RunMode } from "@/config.ts";
import { setDbPoolConnect } from "@ijia/data/query";

export const dbPool = new PgDbQueryPool(() => {
  let url = ENV.DATABASE_URL;
  if (!url) {
    if (ENV.MODE === RunMode.Test || ENV.MODE === RunMode.E2E) {
      url = "postgresql://postgres@localhost:5432/ijia_test";
      console.warn("未配置 DATABASE_URL环境变量, 将使用默认值：" + url);
    } else {
      throw new Error("未配置 DATABASE_URL环境变量");
    }
  }
  return url;
});

setDbPoolConnect(dbPool.connect.bind(dbPool));
