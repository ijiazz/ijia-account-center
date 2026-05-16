import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button, Form, Input, Result, Steps } from "antd";
import { useState } from "react";
import { css } from "@emotion/css";
import { EmailInput } from "@/components/EmailInput.tsx";
import { useMessage } from "@/provider/AntdProvider.tsx";
import { api, isHttpErrorCode } from "@/request/client.ts";
import { ROUTES } from "@/common/router.tsx";
import { useTimeoutJump } from "@/hooks/timeout_jump.ts";
import { tryHashPassword } from "@/common/pwd_hash.ts";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { EmailCaptchaActionType } from "@ijia/account-dto";
import { useMutation } from "@tanstack/react-query";
import { MaskBoard } from "./-components/MaskBoard.tsx";

export const Route = createLazyFileRoute("/find-account")({
  component: RouteComponent,
});

type FindAccountProps = {};

export function RouteComponent(props: FindAccountProps) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const timer = useTimeoutJump({
    timeoutSecond: 5,
    callback: () => navigate({ to: ROUTES.Login, viewTransition: true }),
  });
  return (
    <div className={PageCSS}>
      <MaskBoard>
        <Link to="/login" viewTransition>
          <Button type="text" icon={<ArrowLeftOutlined />}>
            返回登录
          </Button>
        </Link>
        <div className="container">
          <Steps
            current={step}
            items={[
              {
                title: "重置密码",
              },
              { title: "完成" },
            ]}
          />
          <main>
            {step < 1
              ? (
                <Email
                  disabled={step !== 0}
                  onOk={() => {
                    timer.start();
                    setStep(1);
                  }}
                />
              )
              : (
                <Result
                  status="success"
                  title="完成"
                  subTitle="密码已重置"
                  extra={
                    <Link className="e2e-go-to-login" to={ROUTES.Login}>
                      转跳到登录（{timer.resetTime}）
                    </Link>
                  }
                >
                </Result>
              )}
          </main>
        </div>
      </MaskBoard>
    </div>
  );
}

const PageCSS = css`
  background: url("/main/bg-login.webp");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    padding: 24px;
    main {
      margin: auto;
      margin-top: 48px;
    }
  }
`;

function Email(props: { disabled?: boolean; onOk?: () => void }) {
  const { disabled, onOk } = props;

  const { data: emailCaptcha, mutateAsync: sendEmailCaptcha } = useMutation({
    mutationFn: (formData: { email: string; sessionId: string; selected: number[] }) => {
      const { email, sessionId, selected } = formData;
      return api["/captcha/email/send"].post({
        body: {
          email,
          actionType: EmailCaptchaActionType.resetPassword,
          captchaReply: { sessionId, selectedIndex: selected },
        },
      });
    },
  });
  const { isPending: loading, mutateAsync: submit } = useMutation({
    mutationFn: async (formData: ChangePasswordForm) => {
      const res = await tryHashPassword(formData.newPassword);
      const captcha = emailCaptcha;
      if (!captcha) throw new Error("缺少验证码");
      return api["/passport/reset_password"].post({
        body: {
          email: formData.email,
          emailCaptcha: { sessionId: captcha.sessionId, code: formData.email_code },
          newPassword: res.password,
          passwordNoHash: res.passwordNoHash,
        },
      });
    },
    onSuccess: (data) => {
      message.success("密码已修改");
      onOk?.();
    },
  });

  const message = useMessage();
  return (
    <Form disabled={disabled} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }} onFinish={submit}>
      <Form.Item label="电子邮箱" name="email" rules={[{ required: true, type: "email" }]}>
        <EmailInput
          onCaptchaSubmit={async (email, sessionId, selected) => {
            try {
              await sendEmailCaptcha({ email, sessionId, selected });
              message.success("已发送");
            } catch (error) {
              if (isHttpErrorCode(error, "CAPTCHA_ERROR")) message.error("验证码错误");
              throw error;
            }
          }}
        />
      </Form.Item>
      <Form.Item label="邮件验证码" name="email_code" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]}>
        <Input.Password placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="确认密码"
        dependencies={["newPassword"]}
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            async validator(_, value) {
              if (value && getFieldValue("newPassword") !== value) throw new Error("两次密码必须相同");
            },
          }),
        ]}
      >
        <Input.Password placeholder="确认密码" />
      </Form.Item>
      <Form.Item style={{ display: "flex", justifyContent: "end" }}>
        <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>
          确认
        </Button>
      </Form.Item>
    </Form>
  );
}

type ChangePasswordForm = {
  email: string;
  email_code: string;
  newPassword: string;
  confirmPassword: string;
};
