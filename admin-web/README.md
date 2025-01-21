# 管理端前端

基于 React + Zustand + Ant Design 的多租户管理系统前端。

## 功能模块

- 登录注册
  - 租户注册
  - 租户登录
  - 租户信息管理

- 菜单管理
  - 树状菜单配置
  - 路由关联设置
  - 菜单排序

- 接口管理
  - API 配置
  - 请求参数设置
  - 响应格式定义

- 页面管理
  - 页面列表
  - 页面创建
  - 页面编辑

- AI 页面生成器
  - 智能对话
  - 实时预览
  - 代码生成

## 项目结构

```
src/
├── assets/         # 静态资源
├── components/     # 公共组件
├── hooks/          # 自定义 Hooks
├── layouts/        # 布局组件
├── pages/          # 页面组件
├── services/       # API 服务
├── stores/         # 状态管理
├── types/          # 类型定义
├── utils/          # 工具函数
├── App.tsx         # 根组件
└── main.tsx        # 入口文件
```

## 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 环境变量

创建 `.env` 文件：

```env
# API 配置
VITE_API_BASE_URL=http://localhost:3000

# AI 服务配置
VITE_AI_API_KEY=your-api-key
VITE_AI_API_URL=https://api.openai.com/v1/chat/completions
```

## 页面路由

- `/login/:tenantId?` - 登录页面
- `/menu/:tenantId` - 菜单管理
- `/apis/:tenantId` - 接口管理
- `/pages/:tenantId` - 页面管理
- `/page-creator/:tenantId/:pageName` - 页面创建器

## 技术栈

- React 18
- TypeScript
- Zustand（状态管理）
- Ant Design（UI组件）
- Monaco Editor（代码编辑器）
- Axios（HTTP 客户端）
- Vite（构建工具） 