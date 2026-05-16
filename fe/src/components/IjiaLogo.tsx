import { CSSProperties } from "react";
import logoLink from "@/assets/logo/ijia-logo-256.png";

export function IjiaLogo(props: { className?: string; style?: CSSProperties; size?: 64 | 32 | 16 | number }) {
  return (
    <img
      src={logoLink}
      style={{ width: "1em", ...props.style, fontSize: props.size ?? 32 }}
      className={props.className}
    />
  );
}
