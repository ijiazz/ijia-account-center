import { Button, Form, Input } from "antd";
import { useMessage } from "@/provider/AntdProvider.tsx";
import { api } from "@/request/client.ts";
import { CAN_HASH_PASSWORD, hashPassword } from "@/common/pwd_hash.ts";
import { useMutation } from "@tanstack/react-query";

export function ChangePassport() {
  const message = useMessage();

  const { isPending: loading, mutate: onFinish } = useMutation({
    mutationFn: async function (body: { newPassword: string; oldPassword: string }) {
      let { newPassword, oldPassword } = body;
      if (CAN_HASH_PASSWORD) {
        newPassword = await hashPassword(newPassword);
        oldPassword = await hashPassword(oldPassword);
      }
      await api["/passport/change_password"].post({
        body: { newPassword, oldPassword, passwordNoHash: !CAN_HASH_PASSWORD },
      });
    },
    onSuccess: () => {
      message.success("已修改");
    },
  });

  return (
    <div>
      <h3>修改密码</h3>
      <Form name="change_password" onFinish={onFinish} layout="vertical" style={{ maxWidth: 400 }}>
        <Form.Item name="oldPassword" label="旧密码" rules={[{ required: true }]}>
          <Input.Password placeholder="请输入旧密码" />
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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            确认修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
