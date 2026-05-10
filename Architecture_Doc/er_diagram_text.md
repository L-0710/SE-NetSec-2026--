# 校园钓鱼防御平台 - 实体关系图（ER图）

---

## 一、实体列表

### 1. User（用户实体）

| 字段名 | 类型 | 约束 | 说明 |
|:---|:---|:---|:---|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 用户唯一标识 |
| username | VARCHAR(150) | UNIQUE, NOT NULL | 用户名 |
| email | VARCHAR(254) | UNIQUE, NOT NULL | 邮箱地址 |
| password | VARCHAR(128) | NOT NULL | 密码哈希值 |
| role | VARCHAR(20) | DEFAULT 'student' | 用户角色（admin/teacher/student） |
| is_active | BOOLEAN | DEFAULT TRUE | 是否激活 |
| last_login | DATETIME | NULL | 最后登录时间 |

**说明**：继承 Django AbstractUser，支持三种角色：管理员、教师、学生

---

### 2. URLDetection（URL检测记录实体）

| 字段名 | 类型 | 约束 | 说明 |
|:---|:---|:---|:---|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 记录唯一标识 |
| url | VARCHAR(2048) | NOT NULL | 检测的URL地址 |
| is_phishing | BOOLEAN | DEFAULT FALSE | 是否为钓鱼网站 |
| confidence | FLOAT | DEFAULT 0.0 | 检测置信度（0-1） |
| detection_time | DATETIME | NOT NULL | 检测时间 |
| user_id | INTEGER | FOREIGN KEY | 关联用户ID（可空） |

**说明**：记录用户的URL检测历史

---

### 3. EmailAnalysis（邮件分析记录实体）

| 字段名 | 类型 | 约束 | 说明 |
|:---|:---|:---|:---|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 记录唯一标识 |
| email_header | TEXT | NOT NULL | 邮件头内容 |
| is_phishing | BOOLEAN | DEFAULT FALSE | 是否为钓鱼邮件 |
| confidence | FLOAT | DEFAULT 0.0 | 分析置信度（0-1） |
| analysis_time | DATETIME | NOT NULL | 分析时间 |
| user_id | INTEGER | FOREIGN KEY | 关联用户ID（可空） |

**说明**：记录用户的邮件分析历史

---

### 4. PhishingFeature（钓鱼特征库实体）

| 字段名 | 类型 | 约束 | 说明 |
|:---|:---|:---|:---|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 特征唯一标识 |
| feature_type | VARCHAR(20) | NOT NULL | 特征类型（url/email） |
| pattern | VARCHAR(512) | NOT NULL | 特征匹配模式（正则表达式） |
| description | VARCHAR(512) | - | 特征描述 |
| severity | INTEGER | DEFAULT 1 | 严重程度（1-5） |

**说明**：存储钓鱼检测的特征规则库

---

## 二、关系列表

| 关系编号 | 实体1 | 关系类型 | 实体2 | 说明 |
|:---:|:---|:---:|:---|:---|
| R1 | User | 1:N | URLDetection | 一个用户可以发起多次URL检测 |
| R2 | User | 1:N | EmailAnalysis | 一个用户可以发起多次邮件分析 |

---

## 三、ER图结构图

```
                    ┌─────────────────────────────────────┐
                    │           User (用户)              │
                    │  ┌─────────────────────────────┐   │
                    │  │ id (PK)                    │   │
                    │  │ username (UK)              │   │
                    │  │ email (UK)                 │   │
                    │  │ password                   │   │
                    │  │ role                       │   │
                    │  │ is_active                  │   │
                    │  │ last_login                 │   │
                    │  └─────────────────────────────┘   │
                    └──────────────┬──────────────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│   URLDetection          │ │   EmailAnalysis         │ │   PhishingFeature       │
│  (URL检测记录)          │ │  (邮件分析记录)          │ │  (钓鱼特征库)           │
│                         │ │                         │ │                         │
│  id (PK)               │ │  id (PK)               │ │  id (PK)               │
│  url                   │ │  email_header          │ │  feature_type          │
│  is_phishing           │ │  is_phishing           │ │  pattern               │
│  confidence            │ │  confidence            │ │  description           │
│  detection_time        │ │  analysis_time         │ │  severity              │
│  user_id (FK)          │ │  user_id (FK)          │ │                         │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘

                          关系说明:
                          ───────────
                          • User 1:N URLDetection (一个用户可发起多次URL检测)
                          • User 1:N EmailAnalysis (一个用户可发起多次邮件分析)
```

---

## 四、关系详细说明

### R1：User 与 URLDetection（1:N）

| 关系属性 | 说明 |
|:---|:---|
| 关系类型 | 一对多（One-to-Many） |
| 主表 | User（用户） |
| 从表 | URLDetection（URL检测记录） |
| 外键字段 | URLDetection.user_id |
| 级联操作 | SET_NULL（用户删除时，检测记录的user_id设为NULL） |
| 业务含义 | 一个用户可以发起多次URL检测，每次检测生成一条记录 |

### R2：User 与 EmailAnalysis（1:N）

| 关系属性 | 说明 |
|:---|:---|
| 关系类型 | 一对多（One-to-Many） |
| 主表 | User（用户） |
| 从表 | EmailAnalysis（邮件分析记录） |
| 外键字段 | EmailAnalysis.user_id |
| 级联操作 | SET_NULL（用户删除时，分析记录的user_id设为NULL） |
| 业务含义 | 一个用户可以发起多次邮件分析，每次分析生成一条记录 |

---

## 五、数据库表结构汇总

### 表1：users（用户表）

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME NULL,
    date_joined DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 表2：url_detections（URL检测记录表）

```sql
CREATE TABLE url_detections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url VARCHAR(2048) NOT NULL,
    is_phishing BOOLEAN DEFAULT FALSE,
    confidence FLOAT DEFAULT 0.0,
    detection_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### 表3：email_analyses（邮件分析记录表）

```sql
CREATE TABLE email_analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_header TEXT NOT NULL,
    is_phishing BOOLEAN DEFAULT FALSE,
    confidence FLOAT DEFAULT 0.0,
    analysis_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### 表4：phishing_features（钓鱼特征库表）

```sql
CREATE TABLE phishing_features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feature_type VARCHAR(20) NOT NULL,
    pattern VARCHAR(512) NOT NULL,
    description VARCHAR(512),
    severity INTEGER DEFAULT 1
);
```

---

**文档版本**：v1.0  
**生成日期**：2026年5月9日  
**依据**：基于 backend/campus_phishing_backend 中的 models.py 文件生成