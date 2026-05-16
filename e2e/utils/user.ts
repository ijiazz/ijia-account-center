import { dbPool } from "@/db/client.ts";
import { createUser } from "@ijia/school-db/query";
import { api } from "@/utils/fetch.ts";
import { LoginMethod, UserIdentifierType } from "@ijia/account-dto";
import { v } from "@/db/utils.ts";

const E2E_PASSWORD = {
  saved:
    "7bb09a5da06c0db9593efcc439f9c289ac446c084d57b6035e2b8b4d3b1b5d3034091ca9a58ab83d695974a67301df687e7db252d17e57c0089c589155f1676e",
  salt: "3a150d2378a64a49b7ca8d7e80bb51ab",
  raw: "123",
};

async function getNextUserId() {
  const sql = v.gen`SELECT nextval(pg_get_serial_sequence('public.user', 'id'))::INT AS id`;
  const { id: id } = await dbPool.queryFirstRow<{ id: number }>(sql);
  return id;
}
export async function getUniqueEmail() {
  const id = await getNextUserId();
  return `e2e-${id}@ijiazz.cn`.toLocaleLowerCase();
}

export type AccountInfo = {
  id: number;
  name: string;
  email: string;
  password: string;
};
async function createNewUser(name?: string): Promise<AccountInfo> {
  const id = await getNextUserId();
  if (!name) name = `e2e-${id}`;

  const email = `e2e-${id}@ijiazz.cn`.toLocaleLowerCase();
  const res = await createUser(email, {
    id,
    nickname: name,
    password: E2E_PASSWORD.saved,
    salt: E2E_PASSWORD.salt,
  });

  return {
    id: res.user_id,
    name: name,
    email: email,
    password: E2E_PASSWORD.raw,
  };
}

export function initAlice(): Promise<AccountInfo> {
  return createNewUser("Alice");
}

export async function loginGetToken(email: string, pwd: string) {
  const { sessionId } = await api["/captcha/image"].post();
  const { token } = await api["/passport/login"].post({
    body: {
      method: LoginMethod.password,
      user: { email: email, type: UserIdentifierType.email },
      password: pwd,
      passwordNoHash: true,
      captcha: { selectedIndex: [0, 1, 2], sessionId },
    },
  });
  return token;
}
