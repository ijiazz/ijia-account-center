export function getResponseErrorInfo(body: unknown): { message?: string; code?: string } | undefined {
  switch (typeof body) {
    case "string":
      return { message: body };
    case "object": {
      if (body === null) return;
      return body;
    }
    default:
      break;
  }
  return;
}
export function isHttpErrorCode(err: any, code: string | number) {
  return typeof err === "object" && err.code === code;
}

export function fileURIToURL(uri?: undefined | null): undefined;
export function fileURIToURL(uri: string): string;
export function fileURIToURL(uri?: string | null): string | undefined;
export function fileURIToURL(uri?: string | null): string | undefined {
  if (!uri) return;
  if (uri.startsWith("/")) uri = uri.slice(1);
  return `${location.origin}/file/${uri}`;
}
