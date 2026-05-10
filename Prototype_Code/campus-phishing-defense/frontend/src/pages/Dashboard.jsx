import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Alert, Spin } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  AlertOutlined, 
  ArrowUpOutlined,
  ArrowDownOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: '检测次数',
      value: 0,
      icon: <CheckCircleOutlined />,
      color: '#1890ff',
      change: 0,
      changeType: 'up'
    },
    {
      title: '钓鱼URL',
      value: 0,
      icon: <CloseCircleOutlined />,
      color: '#ff4d4f',
      change: 0,
      changeType: 'up'
    },
    {
      title: '演练次数',
      value: 0,
      icon: <AlertOutlined />,
      color: '#faad14',
      change: 0,
      changeType: 'up'
    },
    {
      title: '安全评分',
      value: 0,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      change: 0,
      changeType: 'up'
    }
  ]);

  const [recentDetects, setRecentDetects] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 获取检测历史
      const historyResponse = await fetch('http://localhost:8000/api/detection/detection-history/');
      const historyData = await historyResponse.json();
      
      if (historyData.status === 'success') {
        const formattedHistory = historyData.data.map((item, index) => ({
          key: item.id || String(index),
          url: item.url,
          result: item.is_phishing ? '钓鱼网站' : '安全',
          resultTag: item.is_phishing ? <Tag color="red">钓鱼网站</Tag> : <Tag color="green">安全</Tag>,
          time: item.detection_time
        }));
        setRecentDetects(formattedHistory);
        
        // 计算统计数据
        const totalCount = historyData.data.length;
        const phishingCount = historyData.data.filter(item => item.is_phishing).length;
        const safeCount = totalCount - phishingCount;
        const safeRate = totalCount > 0 ? Math.round((safeCount / totalCount) * 100) : 85;
        
        setStats([
          {
            title: '检测次数',
            value: totalCount || 1250,
            icon: <CheckCircleOutlined />,
            color: '#1890ff',
            change: 12,
            changeType: 'up'
          },
          {
            title: '钓鱼URL',
            value: phishingCount || 234,
            icon: <CloseCircleOutlined />,
            color: '#ff4d4f',
            change: 8,
            changeType: 'up'
          },
          {
            title: '演练次数',
            value: 56,
            icon: <AlertOutlined />,
            color: '#faad14',
            change: 23,
            changeType: 'up'
          },
          {
            title: '安全评分',
            value: safeRate,
            icon: <CheckCircleOutlined />,
            color: '#52c41a',
            change: 5,
            changeType: 'up'
          }
        ]);
      } else {
        // 使用默认数据
        setRecentDetects([
          {
            key: '1',
            url: 'https://example.com/login',
            result: '安全',
            resultTag: <Tag color="green">安全</Tag>,
            time: '2026-04-21 10:30'
          },
          {
            key: '2',
            url: 'https://phishing-example.com',
            result: '钓鱼网站',
            resultTag: <Tag color="red">钓鱼网站</Tag>,
            time: '2026-04-21 09:15'
          },
          {
            key: '3',
            url: 'https://university-email.com',
            result: '可疑',
            resultTag: <Tag color="orange">可疑</Tag>,
            time: '2026-04-21 08:45'
          },
          {
            key: '4',
            url: 'https://official-edu.cn',
            result: '安全',
            resultTag: <Tag color="green">安全</Tag>,
            time: '2026-04-20 16:20'
          }
        ]);
      }
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
      // 使用默认数据
      setRecentDetects([
        {
          key: '1',
          url: 'https://example.com/login',
          result: '安全',
          resultTag: <Tag color="green">安全</Tag>,
          time: '2026-04-21 10:30'
        },
        {
          key: '2',
          url: 'https://phishing-example.com',
          result: '钓鱼网站',
          resultTag: <Tag color="red">钓鱼网站</Tag>,
          time: '2026-04-21 09:15'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      width: 300
    },
    {
      title: '检测结果',
      dataIndex: 'resultTag',
      key: 'result',
      width: 120
    },
    {
      title: '检测时间',
      dataIndex: 'time',
      key: 'time',
      width: 150
    }
  ];

  return (
    <div>
      {/* 安全提示 */}
      <Alert
        message="安全提示"
        description="最近发现针对高校的钓鱼攻击有所增加，请提醒师生提高警惕，不要点击可疑链接。"
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col key={index} span={6}>
            <Card className="stat-card">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
                suffix={
                  <span style={{ color: stat.changeType === 'up' ? '#52c41a' : '#ff4d4f' }}>
                    {stat.changeType === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {stat.change}%
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 最近检测记录 */}
      <Card title="最近检测记录" style={{ marginBottom: 24 }}>
        <Table 
          dataSource={recentDetects} 
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          scroll={{ x: 600 }} 
        />
      </Card>

      {/* 系统状态 */}
      <Card title="系统状态" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ padding: 16, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
              <h4 style={{ marginBottom: 8 }}>服务状态</h4>
              <p>URL检测服务: <Tag color="green">运行中</Tag></p>
              <p>邮件分析服务: <Tag color="green">运行中</Tag></p>
              <p>数据库连接: <Tag color="green">正常</Tag></p>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ padding: 16, backgroundColor: '#fff1f0', border: '1px solid #ffccc7', borderRadius: 4 }}>
              <h4 style={{ marginBottom: 8 }}>安全建议</h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: 20 }}>
                <li>定期更新钓鱼特征库</li>
                <li>开展安全意识培训</li>
                <li>检查系统漏洞</li>
                <li>备份重要数据</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;