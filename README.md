# Godin Low-Code Platform

基于大语言模型的前端工程化低代码平台。

## 项目结构

```
├── admin-server/     # 管理端服务端 (Node.js + Express + MongoDB)
├── admin-web/        # 管理端前端 (React + Zustand + Ant Design)
├── client-template/  # 用户端主应用模板 (React + IceStark)
└── micro-template/   # 微应用模板 (React + IceStark App)
```

## 功能特点

- 🚀 基于大语言模型的智能页面生成
- 🎯 多租户系统架构
- 🔌 微前端架构，支持动态加载微应用
- 🛠 完整的页面、菜单、接口管理功能
- 🔑 租户级别的隔离和权限控制
- 🌐 统一的网关服务和域名管理

## 快速开始

1. 安装依赖
```bash
pnpm install
```

2. 启动开发环境
```bash
# 启动所有服务
pnpm dev

# 或者分别启动各个服务
pnpm --filter admin-server dev
pnpm --filter admin-web dev
pnpm --filter client-template dev
pnpm --filter micro-template dev
```

3. 构建项目
```bash
pnpm build
```

## 访问地址

- 管理端前端：`http://domain.com/`
  - 登录页面：`/login/:tenantId?`
  - 菜单管理：`/menu/:tenantId`
  - 接口管理：`/apis/:tenantId`
  - 页面管理：`/pages/:tenantId`
  - 页面创建器：`/page-creator/:tenantId/:pageName`

- 用户端前端：`http://domain.com/page/:tenantId/`
  - 微应用页面：`/pages/:pageName`

## 技术栈

- 管理端服务端
  - Node.js + Express.js
  - MongoDB（数据存储）
  - Redis（缓存）
  - TypeScript

- 管理端前端
  - React 18
  - TypeScript
  - Zustand（状态管理）
  - Ant Design（UI组件）
  - Vite（构建工具）

- 用户端（主应用）
  - React 18
  - IceStark（微前端框架）
  - TypeScript
  - Ant Design
  - Vite

- 微应用
  - React 18
  - TypeScript
  - IceStark App
  - Ant Design
  - Vite