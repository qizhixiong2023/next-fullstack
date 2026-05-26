import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js 全栈应用",
  description: "基于 Next.js 的全栈应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
