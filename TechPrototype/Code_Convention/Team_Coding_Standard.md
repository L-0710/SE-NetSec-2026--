# 校园钓鱼防御平台 - 团队编码规范

## 一、文档说明

本文档定义了校园钓鱼防御平台项目的编码规范，包括前端（React + JavaScript）和后端（Django + Python）的代码风格和设计规范。

---

## 二、前端编码规范（React + JavaScript）

### 2.1 命名规则

| 类型 | 规则 | 示例 |
| :--- | :--- | :--- |
| 组件名 | 大驼峰（PascalCase） | `UrlDetection.jsx` |
| 变量名 | 小驼峰（camelCase） | `userName` |
| 常量名 | 全大写+下划线 | `API_BASE_URL` |
| 文件命名 | 连字符分隔 | `user-management.jsx` |
| 函数名 | 小驼峰（camelCase） | `handleLogin` |

### 2.2 缩进与格式

- **缩进**：4 个空格
- **行宽**：不超过 100 字符
- **大括号**：Allman 风格（每个大括号单独一行）
- **空行**：
  - 函数/方法之间空一行
  - 逻辑块之间空一行
  - 文件末尾保留一个空行

### 2.3 注释规范

```javascript
/**
 * 组件功能说明
 * @param {Object} props - 组件属性
 * @param {string} props.title - 标题
 */
function MyComponent(props) {
    // 单行注释：说明复杂逻辑
    const result = calculate();
    
    /*
     * 多行注释：
     * 用于复杂业务逻辑的解释
     */
    if (result > 0) {
        return <Success />;
    }
    return <Error />;
}
```

### 2.4 React 组件规范

```javascript
// 1. 导入顺序：第三方库 -> 自定义组件 -> 样式
import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import MyComponent from './MyComponent';
import './styles.css';

// 2. 组件定义
function LoginPage() {
    // 3. 状态定义在组件顶部
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // 4. 副作用钩子
    useEffect(() => {
        document.title = '登录页';
    }, []);
    
    // 5. 事件处理函数
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // API调用逻辑
        } catch (error) {
            console.error('登录失败:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // 6. JSX 渲染
    return (
        <div className="login-container">
            <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="用户名"
            />
            <Button type="primary" loading={loading} onClick={handleSubmit}>
                登录
            </Button>
        </div>
    );
}

export default LoginPage;
```

### 2.5 错误处理规范

```javascript
const fetchData = async () => {
    try {
        const response = await fetch('/api/data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('数据获取失败:', error);
        // 向用户展示友好的错误信息
        message.error('网络错误，请稍后重试');
        throw error; // 允许上层处理
    }
};
```

---

## 三、后端编码规范（Django + Python）

### 3.1 命名规则

| 类型 | 规则 | 示例 |
| :--- | :--- | :--- |
| 类名 | 大驼峰（PascalCase） | `UserSerializer` |
| 函数/方法名 | 下划线分隔（snake_case） | `user_login` |
| 变量名 | 下划线分隔（snake_case） | `user_name` |
| 文件命名 | 下划线分隔 | `user_views.py` |
| 模块名 | 小写字母 | `detection` |

### 3.2 缩进与格式

- **缩进**：4 个空格
- **行宽**：不超过 100 字符
- **空行**：
  - 函数/类之间空两行
  - 逻辑块之间空一行
  - 文件末尾保留一个空行

### 3.3 注释规范

```python
"""
模块说明：用户管理相关视图函数
"""

from django.http import JsonResponse

def user_login(request):
    """
    用户登录接口
    
    参数：
        request: HttpRequest - 请求对象
    
    返回：
        JsonResponse - 登录结果
    """
    # 单行注释：处理请求数据
    data = request.json()
    
    # 复杂逻辑注释
    if validate_user(data):
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'})
```

### 3.4 Django 视图规范

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class LoginAPIView(APIView):
    """用户登录API视图"""
    
    def post(self, request):
        # 1. 获取参数
        username = request.data.get('username')
        password = request.data.get('password')
        
        # 2. 参数验证
        if not username or not password:
            return Response(
                {'message': '用户名和密码不能为空'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 3. 业务逻辑处理
        user = authenticate(username=username, password=password)
        
        if user:
            return Response({'user': serialize(user)}, status=status.HTTP_200_OK)
        
        return Response(
            {'message': '用户名或密码错误'},
            status=status.HTTP_401_UNAUTHORIZED
        )
```

### 3.5 模型规范

```python
from django.db import models

class User(models.Model):
    """用户模型"""
    
    ROLE_CHOICES = (
        ('admin', '管理员'),
        ('teacher', '教师'),
        ('student', '学生'),
    )
    
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    
    class Meta:
        db_table = 'users'
        verbose_name = '用户'
        verbose_name_plural = '用户'
    
    def __str__(self):
        return self.username
```

---

## 四、通用设计规范

### 4.1 设计原则

1. **单一职责原则**：每个类/方法只做一件事
2. **依赖倒置原则**：依赖抽象而非具体实现
3. **开闭原则**：对扩展开放，对修改封闭
4. **接口隔离原则**：客户端不应依赖不需要的接口
5. **里氏替换原则**：子类可替换父类使用

### 4.2 异常处理

```python
# 后端异常处理示例
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    """自定义异常处理器"""
    response = exception_handler(exc, context)
    
    if response is None:
        # 处理未捕获的异常
        return Response(
            {'message': '服务器内部错误'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    return response
```

### 4.3 日志规范

```python
import logging

# 获取模块日志器
logger = logging.getLogger(__name__)

def process_data(data):
    try:
        logger.info(f'开始处理数据: {len(data)} 条')
        
        # 处理逻辑
        result = process(data)
        
        logger.debug(f'处理完成，结果: {result}')
        return result
        
    except ValueError as e:
        logger.warning(f'数据格式错误: {e}')
        raise
    except Exception as e:
        logger.error(f'处理失败: {e}', exc_info=True)
        raise
```

### 4.4 安全规范

1. **输入验证**：所有用户输入必须进行验证和清理
2. **密码处理**：使用 Django 内置的密码哈希机制
3. **SQL注入防护**：使用 Django ORM，避免直接拼接SQL
4. **XSS防护**：前端使用 React 的自动转义功能
5. **CORS配置**：合理配置允许的来源

---

## 五、版本控制规范

### 5.1 分支管理

- **main**：主分支，稳定版本
- **develop**：开发分支，集成所有功能
- **feature/***：功能分支，开发新功能
- **bugfix/***：修复分支，修复bug

### 5.2 提交规范

```
<类型>(<模块>): <描述>

<详细说明（可选）>
```

**类型说明：**
- `feat`：新增功能
- `fix`：修复bug
- `docs`：文档更新
- `style`：代码格式调整
- `refactor`：代码重构
- `test`：测试代码
- `chore`：构建/工具更新

**示例：**
```
feat(user): 添加用户注册功能

- 实现注册API接口
- 添加密码强度验证
- 发送注册确认邮件
```

---

## 六、文档版本

| 版本 | 日期 | 修改内容 | 作者 |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-05-08 | 初始版本 | 团队 |

---

**适用项目**：校园钓鱼防御与宣教平台  
**生效日期**：2026年5月8日