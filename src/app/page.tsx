export default function HomePage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>欢迎使用 Next.js 全栈应用</h1>
      <p style={{ marginTop: "1rem", color: "#666" }}>
        这是一个基于 Next.js、Drizzle ORM 和 PostgreSQL 的全栈应用框架。
      </p>

      <div style={{ marginTop: "2rem" }}>
        <h2>功能模块</h2>
        <ul style={{ marginTop: "1rem" }}>
          <li>
            <a href="/users" style={{ color: "#0070f3", textDecoration: "underline" }}>
              用户管理
            </a>
            {" - 查看和管理用户信息"}
          </li>
        </ul>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>API 端点</h2>
        <ul style={{ marginTop: "1rem", fontFamily: "monospace", fontSize: "0.9rem" }}>
          <li>GET /api/health - 健康检查</li>
          <li style={{ marginTop: "0.5rem" }}>GET /api/users - 获取用户列表</li>
          <li>POST /api/users - 创建用户</li>
          <li>GET /api/users/[id] - 获取用户详情</li>
          <li>PATCH /api/users/[id] - 更新用户</li>
          <li>DELETE /api/users/[id] - 删除用户</li>
        </ul>
      </div>
    </div>
  );
}
