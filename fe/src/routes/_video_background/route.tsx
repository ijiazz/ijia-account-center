import { createFileRoute, Outlet } from "@tanstack/react-router";
import { api } from "@/request/client.ts";
import { CSSProperties, PropsWithChildren } from "react";

export const Route = createFileRoute("/_video_background")({
  async loader(ctx) {
    return api["/passport/config"].get().catch(() => ({}));
  },
  shouldReload: (ctx) => ctx.cause === "enter",
  component: VideoBg,
});
function VideoBg(props: PropsWithChildren<{ style?: CSSProperties; className?: string }>) {
  return (
    <div style={{ height: "100%", position: "relative" }} className={props.className}>
      <div
        style={{
          position: "absolute",
          height: "100%",
          top: 0,
          left: 0,
          overflow: "hidden",
        }}
      >
        <video
          poster="/main/bg-login.webp"
          style={{
            height: "100%",
            width: "100vw",
            objectFit: "cover",
          }}
          muted
          autoPlay
          loop
        >
          <source src="/main/bg-login.mp4" type="video/mp4" />
        </video>
      </div>
      <div style={{ position: "relative", height: "100%", overflow: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}
