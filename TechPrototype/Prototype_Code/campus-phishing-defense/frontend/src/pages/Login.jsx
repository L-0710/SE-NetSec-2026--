import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (values) => {
    setLoading(true);
    
    const endpoint = isLogin 
      ? 'http://localhost:8000/api/user/login/' 
      : 'http://localhost:8000/api/user/register/';
    
    const requestData = isLogin 
      ? { username: values.username, password: values.password }
      : { username: values.username, email: values.email, password: values.password };
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          message.success('登录成功');
          onLogin(data.user);
        } else {
          message.success('注册成功，请登录');
          setIsLogin(true);
        }
      } else {
        message.error(data.message || (isLogin ? '登录失败' : '注册失败'));
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card
        title="校园钓鱼防御与宣教平台"
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <Button
            type={isLogin ? 'primary' : 'default'}
            onClick={() => setIsLogin(true)}
            style={{ marginRight: 8 }}
          >
            登录
          </Button>
          <Button
            type={!isLogin ? 'primary' : 'default'}
            onClick={() => setIsLogin(false)}
          >
            注册
          </Button>
        </div>

        <Form
          name={isLogin ? 'login' : 'register'}
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度需在3-20个字符之间' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          {!isLogin && (
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="邮箱"
                size="large"
              />
            </Form.Item>
          )}

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少6位' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          {!isLogin && (
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
                size="large"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              {isLogin ? '登录' : '注册'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;