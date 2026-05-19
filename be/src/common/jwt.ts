import * as jwtLib from "hono/jwt";
import { ENV } from "@/config.ts";
import {
  AccessJwtPayload,
  AccessToken,
  AccessUserData,
  AuthToken,
  AuthTokenType,
  checkIjiaTokenData,
  SignAccessTokenOption,
} from "@ijia/school-db/auth";

export { AuthTokenType } from "@ijia/school-db/auth";
export type { AccessToken, AccessUserData, SignAccessTokenOption, SignInfo } from "@ijia/school-db/auth";

const authToken = new AuthToken<AccessJwtPayload>({
  parseSysJWT,
  signSysJWT,
  checkData: checkIjiaTokenData,
});

export async function signAccessToken(
  data: AccessUserData,
  option: SignAccessTokenOption = {},
): Promise<AccessToken<AccessUserData>> {
  return authToken.signAccessToken(data, option);
}

export async function verifyAccessToken(accessToken: string): Promise<AccessToken<AccessUserData>> {
  const res = await authToken.verifyAccessToken(accessToken);
  if (res.data.type !== AuthTokenType.User) {
    throw new Error("不支持的令牌类型");
  }
  return res as AccessToken<AccessUserData>;
}

const JWT_KEY = ENV.JWT_KEY;

export function signSysJWT(data: Record<string, any>) {
  return jwtLib.sign(data, JWT_KEY, "HS256");
}
export async function parseSysJWT(accessToken: string): Promise<unknown> {
  return jwtLib.verify(accessToken, JWT_KEY, "HS256");
}
