import React, { useState } from 'react';
import { Card, Button, Table, Tag, Space, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { PlaySquareOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Training = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [trainings, setTrainings] = useState([
    {
      key: '1',
      name: '钓鱼邮件识别培训',
      type: '邮件钓鱼',
      status: '进行中',
      statusTag: <Tag color="blue">进行中</Tag>,
      startDate: '2026-04-15',
      endDate: '2026-04-30',
      participants: 256,
      completion: 65
    },
    {
      key: '2',
      name: 'URL钓鱼检测培训',
      type: 'URL钓鱼',
      status: '已完成',
      statusTag: <Tag color="green">已完成</Tag>,
      startDate: '2026-04-01',
      endDate: '2026-04-14',
      participants: 189,
      completion: 92
    },
    {
      key: '3',
      name: '社会工程学防范',
      type: '综合培训',
      status: '未开始',
      statusTag: <Tag color="orange">未开始</Tag>,
      startDate: '2026-05-01',
      endDate: '2026-05-15',
      participants: 0,
      completion: 0
    }
  ]);

  // 打开创建演练模态框
  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 提交表单
  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const newTraining = {
          key: Date.now().toString(),
          name: values.name,
          type: values.type,
          status: '未开始',
          statusTag: <Tag color="orange">未开始</Tag>,
          startDate: values.dateRange[0].format('YYYY-MM-DD'),
          endDate: values.dateRange[1].format('YYYY-MM-DD'),
          participants: 0,
          completion: 0
        };
        setTrainings([newTraining, ...trainings]);
        setIsModalVisible(false);
        message.success('演练创建成功');
      })
      .catch(info => {
        console.log('Validation failed:', info);
      });
  };

  // 表格列配置
  const columns = [
    {
      title: '演练名称',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '演练类型',
      dataIndex: 'type',
      key: 'type',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'statusTag',
      key: 'status',
      width: 100
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120
    },
    {
      title: '参与人数',
      dataIndex: 'participants',
      key: 'participants',
      width: 100
    },
    {
      title: '完成率',
      dataIndex: 'completion',
      key: 'completion',
      width: 100,
      render: (completion) => `${completion}%`
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="small" icon={<EditOutlined />}>编辑</Button>
          <Button size="small" icon={<DeleteOutlined />} danger>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* 创建演练按钮 */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          创建演练
        </Button>
      </div>

      {/* 演练列表 */}
      <Card title="演练活动管理">
        <Table 
          dataSource={trainings} 
          columns={columns} 
          pagination={{ pageSize: 10 }} 
          scroll={{ x: 900 }} 
        />
      </Card>

      {/* 创建演练模态框 */}
      <Modal
        title="创建演练活动"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="演练名称"
            rules={[{ required: true, message: '请输入演练名称' }]}
          >
            <Input placeholder="请输入演练名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="演练类型"
            rules={[{ required: true, message: '请选择演练类型' }]}
          >
            <Select placeholder="请选择演练类型">
              <Option value="邮件钓鱼">邮件钓鱼</Option>
              <Option value="URL钓鱼">URL钓鱼</Option>
              <Option value="综合培训">综合培训</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="活动时间"
            rules={[{ required: true, message: '请选择活动时间' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="演练描述"
          >
            <Input.TextArea rows={4} placeholder="请输入演练描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Training;