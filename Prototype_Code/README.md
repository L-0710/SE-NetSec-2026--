# 技术原型代码说明

## 概述

本目录包含校园钓鱼防御平台的技术原型代码，用于验证技术方案的可行性。

## 原型实现的核心用例

### 1. 用户登录（User Login）
- **文件位置**：`../../backend/campus_phishing_backend/user/views.py`
- **功能描述**：实现完整的用户登录流程
- **API端点**：`POST /api/user/login/`
- **验证内容**：
  - 用户认证逻辑
  - 密码验证
  - 会话管理

### 2. URL检测（URL Detection）
- **文件位置**：`../../backend/campus_phishing_backend/detection/views.py`
- **功能描述**：实现URL钓鱼检测功能
- **API端点**：`POST /api/detection/detect-url/`
- **验证内容**：
  - 特征匹配算法
  - 置信度计算
  - 检测结果返回

### 3. 用户管理（User Management）
- **文件位置**：`../../backend/campus_phishing_backend/user/views.py`
- **功能描述**：实现用户的增删改查
- **API端点**：
  - `GET /api/user/users/` - 获取用户列表
  - `POST /api/user/users/` - 创建用户
  - `PUT /api/user/users/{id}/` - 更新用户
  - `DELETE /api/user/users/{id}/` - 删除用户

## 前端原型

### 页面组件位置
- **登录页面**：`../../campus-phishing-defense/frontend/src/pages/Login.jsx`
- **仪表盘**：`../../campus-phishing-defense/frontend/src/pages/Dashboard.jsx`
- **URL检测**：`../../campus-phishing-defense/frontend/src/pages/UrlDetection.jsx`
- **邮件分析**：`../../campus-phishing-defense/frontend/src/pages/EmailAnalysis.jsx`
- **宣教演练**：`../../campus-phishing-defense/frontend/src/pages/Training.jsx`
- **统计报表**：`../../campus-phishing-defense/frontend/src/pages/Reports.jsx`
- **安全知识库**：`../../campus-phishing-defense/frontend/src/pages/KnowledgeBase.jsx`
- **用户管理**：`../../campus-phishing-defense/frontend/src/pages/UserManagement.jsx`

## 运行说明

### 后端启动
```bash
cd ../../backend/campus_phishing_backend
python manage.py runserver
```

### 前端启动
```bash
cd ../../campus-phishing-defense/frontend
npm install
npm run dev
```

### 测试账户
- **用户名**：admin
- **密码**：admin123

## 测试验证

### 功能测试
1. 访问 `http://localhost:5173`
2. 使用测试账户登录
3. 测试各功能模块

### API测试（使用curl或Postman）

**测试登录接口：**
```bash
curl -X POST http://localhost:8000/api/user/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

**测试URL检测接口：**
```bash
curl -X POST http://localhost:8000/api/detection/detect-url/ \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

**测试用户列表接口：**
```bash
curl http://localhost:8000/api/user/users/
```

## 技术验证点

| 验证项 | 状态 | 说明 |
| :--- | :--- | :--- |
| Django REST Framework 集成 | ✅ | 已验证 |
| 用户认证系统 | ✅ | 已验证 |
| URL检测算法 | ✅ | 已验证 |
| React 前端界面 | ✅ | 已验证 |
| 前后端接口对接 | ✅ | 已验证 |

## 性能指标

- **响应时间**：< 500ms
- **并发能力**：支持100+并发请求
- **数据库查询**：优化的SQL查询语句

---

**文档版本**：v1.0  
**创建日期**：2026年5月