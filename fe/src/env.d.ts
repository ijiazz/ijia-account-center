/// <reference types="vite/client" />
interface ImportMetaEnv {
  /** Sentry DSN */
  readonly VITE_SENTRY_DSN?: string;
  /**  前端请求后端的 base URL, 可以是 origin 也可以是 pathname */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
