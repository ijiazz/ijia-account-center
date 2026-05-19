# IJIA Account Center

IJIA Account Center 是 IJIA 学院的账号中心仓库，包含前端页面、后端接口、共享 DTO，以及端到端测试。

## 项目结构

| 目录     | 说明                                              |
| -------- | ------------------------------------------------- |
| `fe/`    | 前端，React + TanStack Router + Ant Design + Vite |
| `be/`    | 后端，Deno + Hono                                 |
| `dto/`   | 前后端共享 DTO 与接口类型                         |
| `e2e/`   | Playwright 端到端测试                             |
| `build/` | Dockerfile、Nginx 配置与镜像构建资源              |

## 环境要求

- Deno 2.7.x，建议与仓库内 Docker 镜像保持一致
- Docker / Docker Compose
- 本地开发时可用的 PostgreSQL 与 Redis，或者直接使用仓库内的容器

## 快速开始

### 使用 Docker Compose

在仓库根目录执行：

```sh
docker compose up --build -d
```

默认会启动以下服务：

- `ijiadb`：PostgreSQL，宿主机端口 `5442`
- `redis`：Redis
- `account-center-be`：后端 API，宿主机端口 `9003`
- `account-center-fe`：前端页面，宿主机端口 `9002`（HTTP）和 `9001`（HTTPS）

启动后可访问：

- 前端：http://localhost:9002
- 前端 HTTPS：https://localhost:9001
- 后端 API：http://localhost:9003

停止服务：

```sh
docker compose down
```

### 本地开发

安装依赖依赖，在各子项目目录执行 `deno install`

#### 启动后端

后端入口为 `be/src/main.ts`，在 be 目录下执行 `deno task start` 即可启动后端服务

常用环境变量：

| 变量                | 说明                                   | 默认值                                                                       |
| ------------------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| `MODE`              | 运行模式，支持 `TEST` / `E2E` / `PROD` | `E2E`                                                                        |
| `LISTEN`            | 监听地址，格式为 `host:port`           | `127.0.0.1:3000`                                                             |
| `DATABASE_URL`      | PostgreSQL 连接串                      | `E2E` / `TEST` 模式下默认为 `postgresql://postgres@localhost:5432/ijia_test` |
| `REDIS_CONNECT_URL` | Redis 连接串                           | `redis://127.0.0.1:6379`                                                     |
| `OSS_ROOT_DIR`      | 本地文件存储目录                       | 无                                                                           |
| `JWT_KEY`           | JWT 密钥                               | `E2E` 模式下默认为固定值 `123`                                               |
| `WATCH_CONFIG`      | 是否监听 `be/config.jsonc` 配置变更    | 关闭                                                                         |

#### 启动前端

前端开发服务会通过 Vite 代理 `/api` 到 `http://localhost:3000`。

```sh
cd fe
deno task dev
```

## 配置文件

后端运行时配置位于 `be/config.jsonc`，用于控制邮件发送和账号模块行为。仓库中已给出示例字段，常用项包括：

- `passport.emailVerifyDisabled`：是否关闭邮箱验证
- `passport.signupEnabled`：是否允许注册
- `passport.signupTip`：注册页提示语
- `passport.loginCaptchaDisabled`：登录时是否关闭验证码
- `passport.loginTip`：登录页提示语
- `passport.host`：设置 Cookie 的主域名，例如 `ijiazz.cn`

修改该文件后，若后端设置了 `WATCH_CONFIG=true`，服务会自动重新加载配置。

## 单元测试

后端单元测试默认使用本地 PostgreSQL，并以 `pg://postgres@127.0.0.1:5432/postgres`
作为管理连接。若本地端口或账号不同，可通过环境变量 `PG_URL` 覆盖。

### E2E

先确保前端页面和后端接口已可访问，再执行：

```sh
cd e2e
deno task e2e:run
```

可选环境变量：

- `WEB_URL`：前端地址，默认 `http://localhost:5173`
- `DATABASE_URL`：测试数据库地址，默认 `pg://postgres@localhost:5432/ijia_test`

若需要交互式界面，可执行：

```sh
cd e2e
deno task e2e:local
```
