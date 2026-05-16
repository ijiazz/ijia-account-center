export const BUILD_TIME: Date = new Date(__APP_BUILD_TIME ?? 0);
export const RELEASE_VERSION = "V" + BUILD_TIME.toISOString();

export const IS_ONLINE_HOSTNAME = globalThis.location.hostname.endsWith(".ijiazz.cn");
