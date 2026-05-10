import React, { useState } from 'react';
import { Card, Button, Table, Tag, Space, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([
    {
      key: '1',
      username: 'admin',
      name: '管理员',
      email: 'admin@university.edu.cn',
      role: '管理员',
      roleTag: <Tag color="red">管理员</Tag>,
      status: '正常',
      statusTag: <Tag color="green">正常</Tag>,
      createTime: '2026-04-01',
      lastLogin: '2026-04-21 10:30'
    },
    {
      key: '2',
      username: 'teacher001',
      name: '张老师',
      email: 'zhang@university.edu.cn',
      role: '教师',
      roleTag: <Tag color="blue">教师</Tag>,
      status: '正常',
      statusTag: <Tag color="green">正常</Tag>,
      createTime: '2026-04-05',
      lastLogin: '2026-04-21 09:15'
    },
    {
      key: '3',
      username: 'student001',
      name: '李同学',
      email: 'li@university.edu.cn',
      role: '学生',
      roleTag: <Tag color="green">学生</Tag>,
      status: '正常',
      statusTag: <Tag color="green">正常</Tag>,
      createTime: '2026-04-10',
      lastLogin: '2026-04-20 16:20'
    },
    {
      key: '4',
      username: 'student002',
      name: '王同学',
      email: 'wang@university.edu.cn',
      role: '学生',
      roleTag: <Tag color="green">学生</Tag>,
      status: '禁用',
      statusTag: <Tag color="red">禁用</Tag>,
      createTime: '2026-04-12',
      lastLogin: '2026-04-18 14:30'
    }
  ]);

  const showModal = () => {
    form.resetFields();
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      username: record.username,
      name: record.name,
      email: record.email,
      role: record.role,
      status: record.status
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (editingUser) {
          const updatedUsers = users.map(user => 
            user.key === editingUser.key 
              ? {
                  ...user,
                  ...values,
                  roleTag: values.role === '管理员' ? 
                    <Tag color="red">管理员</Tag> : 
                    values.role === '教师' ? 
                    <Tag color="blue">教师</Tag> : 
                    <Tag color="green">学生</Tag>,
                  statusTag: values.status === '正常' ? 
                    <Tag color="green">正常</Tag> : 
                    <Tag color="red">禁用</Tag>
                }
              : user
          );
          setUsers(updatedUsers);
          message.success('用户更新成功');
        } else {
          const newUser = {
            key: Date.now().toString(),
            ...values,
            roleTag: values.role === '管理员' ? 
              <Tag color="red">管理员</Tag> : 
              values.role === '教师' ? 
              <Tag color="blue">教师</Tag> : 
              <Tag color="green">学生</Tag>,
            statusTag: values.status === '正常' ? 
              <Tag color="green">正常</Tag> : 
              <Tag color="red">禁用</Tag>,
            createTime: new Date().toISOString().split('T')[0],
            lastLogin: '从未登录'
          };
          setUsers([newUser, ...users]);
          message.success('用户创建成功');
        }
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validation failed:', info);
      });
  };

  const handleDelete = (key) => {
    const updatedUsers = users.filter(user => user.key !== key);
    setUsers(updatedUsers);
    message.success('用户删除成功');
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200
    },
    {
      title: '角色',
      dataIndex: 'roleTag',
      key: 'role',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'statusTag',
      key: 'status',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该用户吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button size="small" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          添加用户
        </Button>
      </div>

      <Card title="用户管理">
        <Table 
          dataSource={users} 
          columns={columns} 
          pagination={{ pageSize: 10 }} 
          scroll={{ x: 1200 }} 
        />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 20, message: '用户名最多20个字符' }
            ]}
          >
            <Input placeholder="请输入用户名" disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="管理员">管理员</Option>
              <Option value="教师">教师</Option>
              <Option value="学生">学生</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="正常">正常</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;