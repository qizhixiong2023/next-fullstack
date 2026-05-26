"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  age: number;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bio: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      age: parseInt(formData.age),
      bio: formData.bio || undefined,
    };

    try {
      if (editingId) {
        // Update
        await fetch(`/api/users/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setFormData({ name: "", age: "", bio: "" });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      age: user.age.toString(),
      bio: user.bio || "",
    });
    setEditingId(user.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个用户吗？")) return;

    try {
      await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", age: "", bio: "" });
    setEditingId(null);
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>加载中...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>用户信息管理</h1>

      {/* Form */}
      <div style={{
        marginBottom: "2rem",
        padding: "1.5rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
      }}>
        <h2 style={{ marginBottom: "1rem" }}>
          {editingId ? "编辑用户" : "添加用户"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              姓名 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              年龄 *
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
              min="1"
              max="150"
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              简介
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              maxLength={500}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {editingId ? "更新" : "添加"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "0.5rem 1.5rem",
                  fontSize: "1rem",
                  backgroundColor: "#666",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                取消
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Users List */}
      <div>
        <h2 style={{ marginBottom: "1rem" }}>用户列表</h2>
        {users.length === 0 ? (
          <p style={{ color: "#666" }}>暂无用户数据</p>
        ) : (
          <div style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
          }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "white",
                }}
              >
                <h3 style={{ marginBottom: "0.5rem" }}>{user.name}</h3>
                <p style={{ margin: "0.25rem 0", color: "#666" }}>
                  年龄: {user.age}
                </p>
                {user.bio && (
                  <p style={{ margin: "0.5rem 0", color: "#444" }}>
                    {user.bio}
                  </p>
                )}
                <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.875rem",
                      backgroundColor: "#0070f3",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.875rem",
                      backgroundColor: "#e00",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
