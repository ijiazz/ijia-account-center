import { Button, Form, Input, Modal, Space, Steps } from "antd";
import { useMessage } from "@/provider/AntdProvider.tsx";
import { useEffect, useMemo, useState } from "react";
import { api, isHttpErrorCode } from "@/request/client.ts";
import { MailOutlined } from "@ant-design/icons";
import { HoFetchStatusError } from "@asla/hofetch";
import { EmailInput } from "@/components/EmailInput.tsx";
import { EmailCaptchaActionType } from "@ijia/account-dto";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { EmailAuthentication } from "./EmailAuthentication.tsx";
import { getCurrentAccountInfoQueryOption } from "@/request/passport.ts";
import { queryClient } from "@/request/client.ts";

export function ChangeEmail(props: {}) {
  const { data: accountInfo } = useSuspenseQuery(getCurrentAccountInfoQueryOption());
  const invalidateUser = () => {
    queryClient.invalidateQueries({ queryKey: getCurrentAccountInfoQueryOption().queryKey });
  };
  const [open, setOpen] = useState(false);

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>修改邮箱</h3>
      <Space>
        <MailOutlined />
        <Input className="e2e-current-user" value={accountInfo.email} disabled />
        <Button onClick={() => setOpen(true)}>修改</Button>
      </Space>
      <ChangeEmailModal open={open} oldEmail={accountInfo.email} onClose={() => setOpen(false)} onOk={invalidateUser} />
    </div>
  );
}

function ChangeEmailModal(props: { oldEmail?: string; open?: boolean; onClose?: () => void; onOk?: () => void }) {
  const { onClose, onOk, open, oldEmail } = props;
  const message = useMessage();
  const [token, setToken] = useState<string | null>();
  const step = useMemo(() => (token ? 1 : 0), [token]);
  const { data: newEmailCaptcha, mutateAsync: sendNewEmailCaptcha } = useMutation({
    mutationFn: (param: { email: string; sessionId: string; selected: number[] }) =>
      api["/captcha/email/send"].post({
        body: {
          email: param.email,
          captchaReply: { sessionId: param.sessionId, selectedIndex: param.selected },
          actionType: EmailCaptchaActionType.changeEmail,
        },
      }),
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (param: { code: string; sessionId: string; newEmail: string; token: string }) => {
      return api["/passport/change_email"].post({
        body: {
          emailCaptcha: { sessionId: param.sessionId, code: param.code },
          accountToken: param.token,
          newEmail: param.newEmail,
        },
      });
    },
    onSuccess(data) {
      message.success("修改成功");
      onOk?.();
      onClose?.();
    },
    onError(error) {
      if (error instanceof HoFetchStatusError && error.status === 401) {
        console.dir(error);
        setToken(null);
      }
    },
  });
  const changeEmail = (code: string, newEmail: string) => {
    if (!token) {
      message.error("请先验证原邮箱");
      return;
    }
    if (!newEmailCaptcha) {
      message.error("请先获取验证码");
      return;
    }
    mutateAsync({ code, sessionId: newEmailCaptcha.sessionId, newEmail: newEmail, token });
  };
  useEffect(() => {
    if (open) setToken(null);
  }, [open]);
  return (
    <Modal open={open} onCancel={onClose} title="修改邮箱" footer={null} destroyOnHidden maskClosable={false}>
      <div style={{ maxWidth: 400 }}>
        <Steps
          current={step}
          items={[{ title: "验证原有邮箱" }, { title: "修改邮箱" }]}
          size="small"
          style={{ paddingBottom: "14px" }}
        />
        {step === 0 && <EmailAuthentication onOk={setToken} email={oldEmail} />}
        {step === 1 && (
          <Form onFinish={(formData) => changeEmail(formData.code, formData.newEmail)}>
            <Form.Item name="newEmail" label="新邮箱" rules={[{ required: true, type: "email" }]}>
              <EmailInput
                onCaptchaSubmit={async (email, sessionId, selected) => {
                  try {
                    await sendNewEmailCaptcha({ email, sessionId, selected });
                    message.success("已发送");
                  } catch (error) {
                    if (isHttpErrorCode(error, "CAPTCHA_ERROR")) message.error("验证码错误");
                    throw error;
                  }
                }}
              />
            </Form.Item>
            <Form.Item name="code" label="验证码" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isPending}>
                确认
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </Modal>
  );
}
