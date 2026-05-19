export function unrefTimer(timer: number | { unref: () => void }) {
  if (typeof timer === "number") {
    //@ts-ignore
    Deno.unrefTimer(timer);
  } else {
    timer.unref();
  }
}
