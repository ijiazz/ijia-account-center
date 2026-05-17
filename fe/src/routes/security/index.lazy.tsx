import { createLazyFileRoute } from "@tanstack/react-router";
import { ChangePassport } from "./-components/ChangePassport.tsx";
import { ChangeEmail } from "./-components/ChangeEmail.tsx";
import { useThemeToken } from "@/provider/AntdProvider.tsx";
import { IjiaLogo } from "@/components/IjiaLogo.tsx";
import { Space } from "antd";

export const Route = createLazyFileRoute("/security/")({
  component: RouteComponent,
});

function RouteComponent() {
  const theme = useThemeToken();
  return (
    <div
      style={{
        backgroundColor: theme.colorBgLayout,
        minHeight: "100vh",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 700,
          margin: "0 auto",
          padding: "24px",
          backgroundColor: theme.colorBgContainer,
        }}
      >
        <Space style={{ marginBlockEnd: 20 }}>
          <IjiaLogo />
          <h2 style={{ margin: 0, lineHeight: 1 }}>安全设置</h2>
        </Space>
        <ChangePassport />
        <ChangeEmail />
      </div>
    </div>
  );
}
