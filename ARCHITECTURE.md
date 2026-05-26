# 项目架构文档

## 📋 目录

- [概述](#概述)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [架构设计](#架构设计)
- [数据流向](#数据流向)
- [分层说明](#分层说明)
- [中间件系统](#中间件系统)
- [错误处理](#错误处理)
- [API 响应格式](#api-响应格式)
- [数据库设计](#数据库设计)
- [开发规范](#开发规范)
- [添加新功能](#添加新功能)

---

## 概述

这是一个基于 Next.js 的全栈应用，采用**分层架构**设计，遵循**单一职责原则**和**依赖注入**模式。

### 核心特性

- ✅ **清晰的分层架构**：Controller → Service → Repository
- ✅ **统一的错误处理**：中间件自动捕获和格式化错误
- ✅ **类型安全**：TypeScript + Zod 验证
- ✅ **模块化设计**：按业务功能组织代码
- ✅ **标准化响应**：统一的 API 响应格式

---

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| **框架** | Next.js 16 | React 全栈框架 |
| **语言** | TypeScript 5 | 类型安全 |
| **数据库** | PostgreSQL | 关系型数据库 |
| **ORM** | Drizzle ORM | 轻量级 ORM |
| **验证** | Zod | Schema 验证 |
| **运行时** | Bun | 快速的 JavaScript 运行时 |

---

## 项目结构

```
next-fullstack/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (pages)/              # 前端页面（路由组）
│   │   │   ├── users/            # 用户管理页面
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   ├── api/                  # API 路由（薄层）
│   │   │   ├── health/           # 健康检查
│   │   │   │   └── route.ts
│   │   │   ├── users/            # 用户 API
│   │   │   │   ├── route.ts      # GET /api/users, POST /api/users
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # GET/PATCH/DELETE /api/users/:id
│   │   │   └── ...
│   │   ├── layout.tsx            # 根布局
│   │   └── page.tsx              # 首页
│   │
│   ├── core/                     # 核心功能（全局通用）
│   │   ├── config/               # 配置管理
│   │   │   └── env.ts            # 环境变量验证
│   │   ├── middleware/           # 中间件
│   │   │   ├── async-handler.ts  # 异步错误处理
│   │   │   └── error-handler.ts  # 统一错误格式化
│   │   ├── types/                # 全局类型定义
│   │   │   └── api.ts            # API 响应类型
│   │   └── utils/                # 工具函数
│   │       ├── response.ts       # 响应构建器
│   │       └── errors.ts         # 错误类定义
│   │
│   ├── modules/                  # 业务模块（按功能组织）
│   │   └── users/                # 用户模块
│   │       ├── users.controller.ts   # 控制器：参数验证
│   │       ├── users.service.ts      # 服务层：业务逻辑
│   │       ├── users.repository.ts   # 数据访问层：数据库操作
│   │       └── users.schema.ts       # Zod 验证规则
│   │
│   └── db/                       # 数据库
│       ├── schemas/              # 数据库表定义（按模块分离）
│       │   └── users.ts          # 用户表
│       ├── client.ts             # 数据库客户端
│       ├── schema.ts             # Schema 汇总
│       └── index.ts              # 统一导出
│
├── drizzle/                      # 数据库迁移文件
│   ├── 0000_xxx.sql              # SQL 迁移脚本
│   └── meta/                     # 迁移元数据
│
├── .env.local                    # 环境变量（不提交）
├── drizzle.config.ts             # Drizzle 配置
├── next.config.ts                # Next.js 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 项目依赖
```

---

## 架构设计

### 分层架构图

```
┌─────────────────────────────────────────────────────────┐
│                      用户浏览器                          │
└─────────────────────────────────────────────────────────┘
                            ↓ HTTP 请求
┌─────────────────────────────────────────────────────────┐
│  API Routes (app/api/)                                  │
│  - 接收 HTTP 请求                                        │
│  - 使用 asyncHandler 包装                               │
│  - 委托给 Controller                                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  Controller (modules/*/controller.ts)                   │
│  - 参数验证（Zod）                                       │
│  - 调用 Service                                          │
│  - 构建响应                                              │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  Service (modules/*/service.ts)                         │
│  - 业务逻辑                                              │
│  - 业务规则验证                                          │
│  - 调用 Repository                                       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  Repository (modules/*/repository.ts)                   │
│  - 数据库操作（CRUD）                                    │
│  - 使用 Drizzle ORM                                      │
│  - 返回原始数据                                          │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   PostgreSQL 数据库                      │
└─────────────────────────────────────────────────────────┘
```

---

## 数据流向

### 示例：创建用户

```typescript
// 1. 用户在浏览器提交表单
fetch("/api/users", {
  method: "POST",
  body: JSON.stringify({ name: "张三", age: 25, bio: "简介" })
})

// 2. API Route 接收请求
// src/app/api/users/route.ts
export const POST = asyncHandler(async (request: Request) => {
  const body = await request.json();
  return usersController.create(body);
});

// 3. Controller 验证参数
// src/modules/users/users.controller.ts
async create(body: unknown) {
  const input = createUserSchema.parse(body); // Zod 验证
  const user = await usersService.createUser(input);
  return created(user); // 返回 201
}

// 4. Service 处理业务逻辑
// src/modules/users/users.service.ts
async createUser(input: CreateUserInput) {
  // 可以添加业务规则，如：
  // - 检查用户名是否重复
  // - 发送欢迎邮件
  return usersRepository.create({
    name: input.name,
    age: input.age,
    bio: input.bio ?? null,
  });
}

// 5. Repository 操作数据库
// src/modules/users/users.repository.ts
async create(data: NewUser) {
  const [user] = await db
    .insert(users)
    .values(data)
    .returning();
  return user!;
}

// 6. 返回响应给浏览器
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "张三",
    "age": 25,
    "bio": "简介",
    "createdAt": "2026-05-26T10:00:00Z",
    "updatedAt": "2026-05-26T10:00:00Z"
  }
}
```

---

## 分层说明

### 1. API Routes (`src/app/api/`)

**职责**：处理 HTTP 请求和响应

**规则**：
- ✅ 使用 `asyncHandler` 包装所有路由处理器
- ✅ 只调用 Controller 方法
- ❌ 不包含业务逻辑
- ❌ 不包含参数验证

**示例**：
```typescript
export const GET = asyncHandler(async () => {
  return usersController.list();
});

export const POST = asyncHandler(async (request: Request) => {
  const body = await request.json();
  return usersController.create(body);
});
```

---

### 2. Controller (`src/modules/[feature]/[feature].controller.ts`)

**职责**：请求验证和响应构建

**规则**：
- ✅ 使用 Zod schemas 验证输入
- ✅ 调用 Service 层方法
- ✅ 使用 `response.ts` 工具构建响应
- ✅ 单例模式导出
- ❌ 不包含业务逻辑
- ❌ 不直接操作数据库

**示例**：
```typescript
export class UsersController {
  async create(body: unknown) {
    const input = createUserSchema.parse(body); // 验证
    const user = await usersService.createUser(input); // 调用 Service
    return created(user); // 构建响应
  }
}

export const usersController = new UsersController();
```

---

### 3. Service (`src/modules/[feature]/[feature].service.ts`)

**职责**：业务逻辑实现

**规则**：
- ✅ 实现核心业务规则
- ✅ 调用 Repository 层
- ✅ 抛出业务异常（如 `NotFoundError`）
- ✅ 单例模式导出
- ❌ 不处理 HTTP 请求
- ❌ 不直接操作数据库（通过 Repository）

**示例**：
```typescript
export class UsersService {
  async createUser(input: CreateUserInput) {
    // 业务规则：检查用户名是否重复
    const existing = await usersRepository.findByName(input.name);
    if (existing) {
      throw new ConflictError("用户名已存在");
    }
    
    // 调用 Repository
    return usersRepository.create(input);
  }
}

export const usersService = new UsersService();
```

---

### 4. Repository (`src/modules/[feature]/[feature].repository.ts`)

**职责**：数据访问

**规则**：
- ✅ 只包含数据库查询
- ✅ 使用 Drizzle ORM
- ✅ 返回原始数据
- ✅ 单例模式导出
- ❌ 不包含业务逻辑
- ❌ 不抛出业务异常（返回 null/undefined）

**示例**：
```typescript
export class UsersRepository {
  async findById(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }
  
  async create(data: NewUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning();
    return user!;
  }
}

export const usersRepository = new UsersRepository();
```

---

## 中间件系统

### 1. `asyncHandler` - 自动错误处理

**作用**：自动捕获异步函数中的错误

**实现**：
```typescript
// src/core/middleware/async-handler.ts
export function asyncHandler<T>(handler: AsyncRouteHandler<T>) {
  return async (request: Request, context: T) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error); // 自动处理错误
    }
  };
}
```

**使用**：
```typescript
export const GET = asyncHandler(async () => {
  // 任何错误都会被自动捕获
  return controller.list();
});
```

---

### 2. `handleError` - 统一错误格式化

**作用**：将各种错误转换成统一的 JSON 格式

**支持的错误类型**：
- `ZodError` → 400 (验证错误)
- `NotFoundError` → 404 (资源不存在)
- `ApiError` → 自定义状态码
- 其他错误 → 500 (服务器错误)

**实现**：
```typescript
// src/core/middleware/error-handler.ts
export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: error.issues,
        },
      },
      { status: 400 }
    );
  }
  
  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: error.message,
        },
      },
      { status: 404 }
    );
  }
  
  // ... 其他错误处理
}
```

---

## 错误处理

### 错误类定义

```typescript
// src/core/utils/errors.ts

// 基础错误类
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// 404 错误
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}
```

### 使用示例

```typescript
// Service 层抛出错误
async getUserById(id: string) {
  const user = await repository.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

// 中间件自动捕获并格式化
// 返回：{ success: false, error: { code: "NOT_FOUND", message: "User not found" } }
```

---

## API 响应格式

### 成功响应

```typescript
{
  "success": true,
  "data": {
    // 实际数据
  }
}
```

**状态码**：
- `200 OK` - 查询成功
- `201 Created` - 创建成功
- `204 No Content` - 删除成功（无内容）

### 错误响应

```typescript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": { /* 可选的详细信息 */ }
  }
}
```

**常见错误码**：
- `VALIDATION_ERROR` (400) - 参数验证失败
- `NOT_FOUND` (404) - 资源不存在
- `INTERNAL_SERVER_ERROR` (500) - 服务器错误

### 响应构建器

```typescript
// src/core/utils/response.ts
ok(data)        // 200 { success: true, data: ... }
created(data)   // 201 { success: true, data: ... }
noContent()     // 204 (无内容)
```

---

## 数据库设计

### Schema 定义

```typescript
// src/db/schemas/users.ts
import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### 迁移流程

```bash
# 1. 修改 schema
# 编辑 src/db/schemas/users.ts

# 2. 生成迁移文件
bun run db:generate

# 3. 运行迁移
bun run db:migrate

# 4. 查看数据库
bun run db:studio
```

---

## 开发规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `users.controller.ts` |
| 类名 | PascalCase | `UsersController` |
| 函数/变量 | camelCase | `createUser` |
| 常量 | UPPER_SNAKE_CASE | `MAX_AGE` |
| 类型/接口 | PascalCase | `User`, `CreateUserInput` |

### 代码组织

**单一职责**：
- 每个文件只负责一件事
- 每个函数只做一件事
- 每个类只有一个改变的理由

**依赖方向**：
```
API Routes → Controller → Service → Repository → Database
```
- 上层可以依赖下层
- 下层不能依赖上层

**单例模式**：
```typescript
export class UsersService { /* ... */ }
export const usersService = new UsersService();
```

### 最佳实践

1. **不要过度设计**
   - 三个相似的代码块不需要立即抽象
   - 等到真正需要复用时再重构

2. **默认不写注释**
   - 用清晰的命名代替注释
   - 只在非显而易见的地方写注释（为什么这样做）

3. **错误处理**
   - Service 层抛出业务异常
   - Repository 层返回 null/undefined
   - 中间件统一处理错误

4. **类型安全**
   - 使用 TypeScript 严格模式
   - 使用 Zod 验证外部输入
   - 避免使用 `any`

---

## 添加新功能

### 步骤 1：创建数据库 Schema

```typescript
// src/db/schemas/posts.ts
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  // ...
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

```typescript
// src/db/schema.ts
export * from "./schemas/users";
export * from "./schemas/posts"; // 添加这行
```

### 步骤 2：生成迁移

```bash
bun run db:generate
bun run db:migrate
```

### 步骤 3：创建 Zod Schema

```typescript
// src/modules/posts/posts.schema.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

export const updatePostSchema = createPostSchema.partial();
export const postIdSchema = z.string().uuid();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
```

### 步骤 4：创建 Repository

```typescript
// src/modules/posts/posts.repository.ts
import { db } from "@/db";
import { posts } from "@/db/schema";

export class PostsRepository {
  async findAll() {
    return db.select().from(posts);
  }
  
  async findById(id: string) {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);
    return post;
  }
  
  async create(data: NewPost) {
    const [post] = await db
      .insert(posts)
      .values(data)
      .returning();
    return post!;
  }
  
  // ... update, delete
}

export const postsRepository = new PostsRepository();
```

### 步骤 5：创建 Service

```typescript
// src/modules/posts/posts.service.ts
import { NotFoundError } from "@/core/utils/errors";
import { postsRepository } from "./posts.repository";

export class PostsService {
  async listPosts() {
    return postsRepository.findAll();
  }
  
  async getPostById(id: string) {
    const post = await postsRepository.findById(id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  }
  
  async createPost(input: CreatePostInput) {
    return postsRepository.create(input);
  }
  
  // ... update, delete
}

export const postsService = new PostsService();
```

### 步骤 6：创建 Controller

```typescript
// src/modules/posts/posts.controller.ts
import { ok, created, noContent } from "@/core/utils/response";
import { postsService } from "./posts.service";
import { createPostSchema, postIdSchema } from "./posts.schema";

export class PostsController {
  async list() {
    const posts = await postsService.listPosts();
    return ok(posts);
  }
  
  async getById(id: string) {
    const validatedId = postIdSchema.parse(id);
    const post = await postsService.getPostById(validatedId);
    return ok(post);
  }
  
  async create(body: unknown) {
    const input = createPostSchema.parse(body);
    const post = await postsService.createPost(input);
    return created(post);
  }
  
  // ... update, delete
}

export const postsController = new PostsController();
```

### 步骤 7：创建 API Routes

```typescript
// src/app/api/posts/route.ts
import { asyncHandler } from "@/core/middleware/async-handler";
import { postsController } from "@/modules/posts/posts.controller";

export const GET = asyncHandler(async () => {
  return postsController.list();
});

export const POST = asyncHandler(async (request: Request) => {
  const body = await request.json();
  return postsController.create(body);
});
```

```typescript
// src/app/api/posts/[id]/route.ts
import { asyncHandler } from "@/core/middleware/async-handler";
import { postsController } from "@/modules/posts/posts.controller";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = asyncHandler(async (_request: Request, context: RouteContext) => {
  const { id } = await context.params;
  return postsController.getById(id);
});

// ... PATCH, DELETE
```

### 步骤 8：创建前端页面（可选）

```typescript
// src/app/(pages)/posts/page.tsx
"use client";

export default function PostsPage() {
  // 实现页面逻辑
}
```

### 步骤 9：测试

```bash
# 构建验证
bun run build

# 启动开发服务器
bun run dev

# 测试 API
curl http://localhost:3000/api/posts
```

---

## 总结

这个架构的核心思想：

1. **分层清晰**：每一层只做自己的事
2. **职责单一**：每个文件、每个函数都有明确的职责
3. **易于测试**：每一层都可以独立测试
4. **易于维护**：修改某一层不影响其他层
5. **易于扩展**：添加新功能只需按模板创建文件

这个框架可能还有点不合理不规范，看怎么改，后期好按这个走，当个开发手册
