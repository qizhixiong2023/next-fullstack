# Next Fullstack API

一个简洁、干净、可扩展的 Next.js API 后台项目骨架，使用 PostgreSQL、Drizzle ORM、Bun 和 TypeScript。

## 快速开始

安装依赖：

```bash
bun install
```

创建本地环境变量文件：

```bash
cp .env.example .env.local
```

初步访问：

```bash
http://localhost:3000/api/health
```

启动 PostgreSQL 数据库：

```bash
docker compose up -d
```

生成并执行数据库迁移：

```bash
bun run db:generate
bun run db:migrate
```

启动开发服务：

```bash
bun dev
```

最终访问：

```bash
http://localhost:3000/users
```

## API

- `GET /api/health` - 健康检查
- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建用户
- `GET /api/users/:id` - 获取用户详情
- `PATCH /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

## 项目结构

```txt
src/
  app/
    (pages)/        前端页面
    api/            API 路由处理
  core/
    config/         配置管理
    middleware/     中间件
    types/          全局类型
    utils/          工具函数
  db/
    schemas/        数据库表定义
    client.ts       数据库客户端
    schema.ts       Schema 汇总
    index.ts        统一导出
  modules/          业务模块（按功能分层）
drizzle/            数据库迁移文件
```

## 常用脚本

- `bun dev`：本地启动 API 服务。
- `bun run build`：构建 Next.js 应用。
- `bun run lint`：运行代码检查。
- `bun run db:generate`：生成 Drizzle 数据库迁移。
- `bun run db:migrate`：执行 Drizzle 数据库迁移。
- `bun run db:studio`：打开 Drizzle Studio。

当前阶段只搭建基础项目框架，暂不包含鉴权、权限控制和生产部署加固。
现在是先搭建一个框架，还不知道写一个什么项目练手的