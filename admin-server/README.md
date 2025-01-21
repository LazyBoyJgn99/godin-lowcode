# 管理端服务端

基于 Node.js + Express + MongoDB 的多租户管理系统后端。

## 功能模块

- 用户管理
  - 租户注册
  - 租户登录
  - 租户信息管理

- 页面管理
  - 页面创建
  - 页面配置存储
  - 页面列表查询

- 菜单管理
  - 树状结构菜单配置
  - 菜单权限控制
  - 路由关联

- 接口管理
  - API 配置管理
  - 接口代理
  - 接口权限控制

- 网关服务
  - 静态资源代理
  - API 网关
  - 域名管理

## 项目结构

```
src/
├── config/         # 配置文件
├── controllers/    # 控制器
├── middlewares/    # 中间件
├── models/         # 数据模型
├── routes/         # 路由
├── services/       # 业务逻辑
├── utils/          # 工具函数
└── index.ts        # 入口文件
```

## 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 启动生产服务器
pnpm start
```

## 环境变量

创建 `.env` 文件：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/godin-lowcode
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# 跨域配置
CORS_ORIGIN=http://localhost:3001
```

## API 文档

### 认证相关

- POST `/api/auth/register` - 租户注册
- POST `/api/auth/login` - 租户登录
- GET `/api/auth/profile` - 获取租户信息

### 页面管理

- POST `/api/pages` - 创建页面
- GET `/api/pages` - 获取页面列表
- GET `/api/pages/:id` - 获取页面详情
- PUT `/api/pages/:id` - 更新页面
- DELETE `/api/pages/:id` - 删除页面

### 菜单管理

- POST `/api/menus` - 创建菜单
- GET `/api/menus` - 获取菜单树
- PUT `/api/menus/:id` - 更新菜单
- DELETE `/api/menus/:id` - 删除菜单

### 接口管理

- POST `/api/apis` - 创建API配置
- GET `/api/apis` - 获取API列表
- PUT `/api/apis/:id` - 更新API配置
- DELETE `/api/apis/:id` - 删除API配置 