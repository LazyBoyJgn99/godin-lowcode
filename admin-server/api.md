# Admin Server API 文档

## 目录
- [租户认证接口](#租户认证接口)
- [API管理接口](#API管理接口)
- [页面管理接口](#页面管理接口)
- [菜单管理接口](#菜单管理接口)

## 租户认证接口

### 租户注册
- **接口**: `POST /api/tenant/register`
- **描述**: 注册新租户
- **请求头**:
  - Content-Type: application/json
- **请求参数**:
  ```json
  {
    "name": "string",      // 租户名称
    "email": "string",     // 邮箱（唯一）
    "password": "string"   // 密码
  }
  ```
- **响应**:
  ```json
  {
    "tenant": {
      "id": "string",
      "name": "string",
      "email": "string",
      "createdAt": "string",
      "updatedAt": "string"
    },
    "token": "string"      // JWT token
  }
  ```

### 租户登录
- **接口**: `POST /api/tenant/login`
- **描述**: 租户登录系统
- **请求头**:
  - Content-Type: application/json
- **请求参数**:
  ```json
  {
    "email": "string",     // 邮箱
    "password": "string"   // 密码
  }
  ```
- **响应**:
  ```json
  {
    "tenant": {
      "id": "string",
      "name": "string",
      "email": "string",
      "createdAt": "string",
      "updatedAt": "string"
    },
    "token": "string"      // JWT token
  }
  ```

### 获取当前租户信息
- **接口**: `GET /api/tenant/me`
- **描述**: 获取当前登录租户的信息
- **请求头**:
  - Authorization: Bearer <token>
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### 更新租户信息
- **接口**: `PUT /api/tenant/me`
- **描述**: 更新当前租户信息
- **请求头**:
  - Authorization: Bearer <token>
  - Content-Type: application/json
- **请求参数**:
  ```json
  {
    "name": "string",      // 可选，租户名称
    "email": "string",     // 可选，邮箱
    "password": "string"   // 可选，密码
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

## API管理接口

### 获取API列表
- **接口**: `GET /api/apis`
- **描述**: 获取当前租户的所有API配置
- **请求头**:
  - Authorization: Bearer <token>
- **响应**:
  ```json
  {
    "apis": [
      {
        "id": "string",
        "name": "string",
        "method": "string",
        "path": "string",
        "targetUrl": "string",
        "headers": "object",
        "parameters": "object",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

### 创建API
- **接口**: `POST /api/apis`
- **描述**: 创建新的API配置
- **请求头**:
  - Authorization: Bearer <token>
  - Content-Type: application/json
- **请求参数**:
  ```json
  {
    "name": "string",         // API名称，租户下唯一
    "method": "GET|POST|PUT|DELETE|PATCH", // 请求方法
    "path": "string",         // API路径
    "targetUrl": "string",    // 目标URL
    "parameters": {           // 可选，参数配置
      "query": [
        {
          "name": "string",
          "type": "string|number|boolean|object|array",
          "required": true,
          "description": "string",
          "default": "any"
        }
      ],
      "body": [],
      "path": []
    },
    "headers": {             // 可选，请求头配置
      "headerName": "headerValue"
    }
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "method": "string",
    "path": "string",
    "targetUrl": "string",
    "tenantId": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "config": {
      "parameters": {},
      "headers": {}
    }
  }
  ```

### 获取API详情
- **接口**: `GET /api/apis/:id`
- **描述**: 获取特定API配置详情
- **请求头**:
  - Authorization: Bearer <token>
- **路径参数**:
  - id: API ID
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "method": "string",
    "path": "string",
    "targetUrl": "string",
    "tenantId": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "config": {
      "parameters": {},
      "headers": {}
    }
  }
  ```

### 更新API
- **接口**: `PUT /api/apis/:id`
- **描述**: 更新API配置
- **请求头**:
  - Authorization: Bearer <token>
  - Content-Type: application/json
- **路径参数**:
  - id: API ID
- **请求参数**:
  ```json
  {
    "name": "string",         // 可选，API名称
    "method": "string",       // 可选，请求方法
    "path": "string",         // 可选，API路径
    "targetUrl": "string",    // 可选，目标URL
    "parameters": {},         // 可选，参数配置
    "headers": {}            // 可选，请求头配置
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "method": "string",
    "path": "string",
    "targetUrl": "string",
    "tenantId": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "config": {
      "parameters": {},
      "headers": {}
    }
  }
  ```

### 删除API
- **接口**: `DELETE /api/apis/:id`
- **描述**: 删除API配置
- **请求头**:
  - Authorization: Bearer <token>
- **路径参数**:
  - id: API ID
- **响应**:
  ```json
  {
    "message": "API deleted successfully"
  }
  ```

## 页面管理接口

### 创建页面
- **接口**: `POST /api/pages`
- **描述**: 创建新页面
- **请求头**:
  - Authorization: Bearer <token>
  - Content-Type: application/json
- **请求参数**:
  ```json
  {
    "pageName": "string",    // 页面名称（租户下唯一）
    "title": "string",       // 页面标题
    "content": "string",     // 可选，页面内容（JSON格式的页面配置）
    "status": "draft|published"  // 可选，页面状态，默认为draft
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "pageName": "string",
    "title": "string",
    "content": "string",
    "status": "string",
    "buildPath": "string",   // 构建文件路径
    "tenantId": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### 获取页面列表
- **接口**: `GET /api/pages`
- **描述**: 获取当前租户的所有页面
- **请求头**:
  - Authorization: Bearer <token>
- **响应**:
  ```json
  {
    "pages": [
      {
        "id": "string",
        "pageName": "string",
        "title": "string",
        "content": "string",
        "status": "string",
        "buildPath": "string",
        "tenantId": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

### 获取页面详情
- **接口**: `GET /api/pages/:id`
- **描述**: 获取特定页面详情
- **请求头**:
  - Authorization: Bearer <token>
- **路径参数**:
  - id: 页面ID
- **响应**:
  ```json
  {
    "id": "string",
    "pageName": "string",
    "title": "string",
    "content": "string",
    "status": "string",
    "buildPath": "string",
    "tenantId": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### 更新页面
- **接口**: `PUT /api/pages/:id`
- **描述**: 更新页面信息
- **请求头**:
  - Authorization: Bearer <token>
  - Content-Type: application/json
- **路径参数**:
  - id: 页面ID
- **请求参数**:
  ```json
  {
    "pageName": "string",    // 可选，页面名称
    "title": "string",       // 可选，页面标题
    "content": "string",     // 可选，页面内容（JSON格式的页面配置）
    "status": "draft|published"  // 可选，页面状态
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "pageName": "string",
    "title": "string",
    "content": "string",
    "status": "string",
    "buildPath": "string",
    "tenantId": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### 删除页面
- **接口**: `DELETE /api/pages/:id`
- **描述**: 删除页面
- **请求头**:
  - Authorization: Bearer <token>
- **路径参数**:
  - id: 页面ID
- **响应**:
  ```json
  {
    "message": "Page deleted successfully"
  }
  ```

**注意事项**:
1. 页面名称在租户下必须唯一
2. 创建或更新页面时，如果提供了content字段，系统会自动构建页面
3. 构建的文件会保存在 `/pages/{租户ID}/pages/{pageName}/build/` 目录下
4. 删除页面时会同时删除对应的构建文件
5. 页面状态包括：
   - draft: 草稿状态
   - published: 已发布状态

## 菜单管理接口

### 创建菜单
- **接口**: `POST /api/menus`
- **描述**: 创建新的菜单项
- **请求头**:
  - Authorization: Bearer <token>
  - Content-Type: application/json
- **请求参数**:
  ```json
  {
    "name": "string",       // 菜单名称
    "path": "string",       // 可选，菜单路径
    "icon": "string",       // 可选，菜单图标
    "sort": "number",       // 可选，排序序号（不指定时自动计算）
    "parentId": "string",   // 可选，父菜单ID
    "pageId": "string"      // 可选，关联的页面ID
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "path": "string",
    "icon": "string",
    "sort": "number",
    "parentId": "string",
    "pageId": "string",
    "buildPath": "string",  // 如果关联了页面，返回页面构建产物路径
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### 获取菜单树
- **接口**: `GET /api/menus`
- **描述**: 获取当前租户的菜单树结构
- **请求头**:
  - Authorization: Bearer <token>
- **响应**:
  ```json
  {
    "menus": [
      {
        "id": "string",
        "name": "string",
        "path": "string",
        "icon": "string",
        "sort": "number",
        "parentId": "string",
        "pageId": "string",
        "buildPath": "string",  // 如果关联了页面，返回页面构建产物路径
        "children": [           // 子菜单数组
          {
            // 子菜单结构与父菜单相同
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

### 更新菜单
- **接口**: `PUT /api/menus/:id`
- **描述**: 更新指定菜单项
- **请求头**:
  - Authorization: Bearer <token>
  - Content-Type: application/json
- **路径参数**:
  - id: 菜单ID
- **请求参数**:
  ```json
  {
    "name": "string",       // 可选，菜单名称
    "path": "string",       // 可选，菜单路径
    "icon": "string",       // 可选，菜单图标
    "sort": "number",       // 可选，排序序号
    "parentId": "string",   // 可选，父菜单ID
    "pageId": "string"      // 可选，关联的页面ID
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "path": "string",
    "icon": "string",
    "sort": "number",
    "parentId": "string",
    "pageId": "string",
    "buildPath": "string",  // 如果关联了页面，返回页面构建产物路径
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### 删除菜单
- **接口**: `DELETE /api/menus/:id`
- **描述**: 删除指定菜单项及其所有子菜单
- **请求头**:
  - Authorization: Bearer <token>
- **路径参数**:
  - id: 菜单ID
- **响应**:
  ```json
  {
    "message": "Menu deleted successfully"
  }
  ```

### 批量更新菜单排序
- **接口**: `PUT /api/menus/batch-sort`
- **描述**: 批量更新菜单的排序序号
- **请求头**:
  - Authorization: Bearer <token>
  - Content-Type: application/json
- **请求参数**:
  ```json
  {
    "items": [
      {
        "id": "string",     // 菜单ID
        "sort": "number"    // 新的排序序号
      }
    ]
  }
  ```
- **响应**:
  ```json
  {
    "message": "Menu sort updated successfully"
  }
  ```

**注意事项**:
1. 菜单支持无限层级的树状结构
2. 菜单节点可以是空节点（不关联页面），也可以关联到具体页面
3. 关联页面的菜单节点会包含页面构建产物的路径（buildPath）
4. 删除菜单时会递归删除所有子菜单
5. 排序规则：
   - 同级菜单按sort字段升序排序
   - 不指定sort时，会自动计算（同级最大值+1）
   - 支持批量更新排序
6. 安全性：
   - 所有接口都需要认证
   - 租户只能操作自己的菜单
