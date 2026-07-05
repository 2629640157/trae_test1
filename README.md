# 文档版本审批系统

使用 React + TypeScript 实现前端工作台，使用 PHP 实现轻量 REST API。系统覆盖文档基础信息、多版本管理、审批流程、发布管控、权限隔离和多条件检索。

## 演示账号

- `admin / admin123`：管理员、文档管理员、发布人、审计员
- `author / author123`：作者
- `approver / approver123`：审批人

## 前端运行

```bash
npm install
npm run dev
```

## PHP API 运行

当前机器未检测到 PHP，可在安装 PHP 后运行：

```bash
php -S localhost:8080 -t api/public
```

前端 API 默认地址为 `http://localhost:8080/api`，可通过 `.env` 中的 `VITE_API_BASE_URL` 覆盖。

## 目录

- `.trae/documents`：PRD 与技术架构文档
- `src`：React 前端源码
- `api/public/index.php`：PHP API 入口
- `api/data/seed.json`：演示数据
- `api/database/schema.sql`：MySQL 初始化脚本
