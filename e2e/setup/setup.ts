import { dbPool } from "@/db/client.ts";
import { insertIntoValues } from "@/db/utils.ts";

export default async function setup() {
  await initRoles();

  console.log("setup complete");
}

export async function initRoles() {
  const sql = insertIntoValues("role", [
    { id: "root", role_name: "超级管理员", description: "超级管理员" },
    { id: "admin", role_name: "管理员", description: "管理员" },
  ])
    .onConflict("id")
    .doNotThing();

  await dbPool.execute(sql);
}
