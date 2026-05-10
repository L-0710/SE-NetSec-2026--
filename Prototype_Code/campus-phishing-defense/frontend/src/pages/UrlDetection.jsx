import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Table, Tag, Alert, Space, Divider, Spin, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const UrlDetection = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // 初始化加载历史记录
  useEffect(() => {
    fetchDetectionHistory();
  }, []);

  // 获取检测历史
  const fetchDetectionHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/detection/detection-history/');
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        const formattedHistory = data.data.map((item, index) => ({
          key: item.id || String(index),
          url: item.url,
          result: item.is_phishing ? '钓鱼网站' : '安全',
          resultTag: item.is_phishing ? <Tag color="red">钓鱼网站</Tag> : <Tag color="green">安全</Tag>,
          time: item.detection_time,
          details: item.is_phishing ? 
            '该URL包含钓鱼特征，与已知钓鱼网站相似' : 
            '该URL属于合法域名，未发现钓鱼特征',
          confidence: item.confidence
        }));
        setHistory(formattedHistory);
      } else {
        // 如果获取失败，使用默认模拟数据
        setHistory([
          {
            key: '1',
            url: 'https://example.com/login',
            result: '安全',
            resultTag: <Tag color="green">安全</Tag>,
            time: '2026-04-21 10:30',
            details: '该URL属于合法域名，未发现钓鱼特征'
          },
          {
            key: '2',
            url: 'https://phishing-example.com',
            result: '钓鱼网站',
            resultTag: <Tag color="red">钓鱼网站</Tag>,
            time: '2026-04-21 09:15',
            details: '该URL包含钓鱼特征，与已知钓鱼网站相似'
          },
          {
            key: '3',
            url: 'https://university-email.com',
            result: '可疑',
            resultTag: <Tag color="orange">可疑</Tag>,
            time: '2026-04-21 08:45',
            details: '该URL域名与高校邮箱相似，存在钓鱼风险'
          }
        ]);
      }
    } catch (error) {
      message.error('获取检测历史失败');
      // 使用默认模拟数据
      setHistory([
        {
          key: '1',
          url: 'https://example.com/login',
          result: '安全',
          resultTag: <Tag color="green">安全</Tag>,
          time: '2026-04-21 10:30',
          details: '该URL属于合法域名，未发现钓鱼特征'
        },
        {
          key: '2',
          url: 'https://phishing-example.com',
          result: '钓鱼网站',
          resultTag: <Tag color="red">钓鱼网站</Tag>,
          time: '2026-04-21 09:15',
          details: '该URL包含钓鱼特征，与已知钓鱼网站相似'
        }
      ]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // URL 验证函数
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // 真实API检测函数
  const handleDetect = async () => {
    if (!url) {
      message.error('请输入要检测的URL');
      return;
    }
    
    if (!validateUrl(url)) {
      message.error('请输入有效的URL格式，例如：https://example.com');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/detection/detect-url/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const resultText = data.is_phishing ? '钓鱼网站' : '安全';
        const newResult = {
          url: data.url,
          result: resultText,
          time: new Date().toLocaleString(),
          details: data.is_phishing ? 
            '该URL包含钓鱼特征，与已知钓鱼网站相似' : 
            '该URL属于合法域名，未发现钓鱼特征'
        };
        
        setResult(newResult);
        setHistory([
          {
            key: Date.now().toString(),
            url: newResult.url,
            result: newResult.result,
            resultTag: newResult.result === '安全' ? 
              <Tag color="green">安全</Tag> : 
              <Tag color="red">钓鱼网站</Tag>,
            time: newResult.time,
            details: newResult.details
          },
          ...history
        ]);
        // 检测完成后刷新历史记录
        fetchDetectionHistory();
        message.success('检测完成');
      } else {
        message.error(data.message || '检测失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
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
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button size="small" onClick={() => setResult({
          url: record.url,
          result: record.result,
          time: record.time,
          details: record.details
        })}>
          查看详情
        </Button>
      )
    }
  ];

  return (
    <div>
      {/* URL检测表单 */}
      <Card title="URL检测" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="请输入要检测的URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '100%' }}
            addonAfter={
              <Button 
                type="primary" 
                onClick={handleDetect}
                loading={loading}
              >
                检测
              </Button>
            }
          />
          <div style={{ color: '#666', fontSize: '12px' }}>
            示例: https://example.com
          </div>
        </Space>
      </Card>

      {/* 加载状态 */}
      {loading && (
        <div className="loading-container">
          <Spin size="large" tip="正在检测中..." />
        </div>
      )}

      {/* 检测结果 */}
      {result && (
        <Card 
          title="检测结果" 
          style={{ marginBottom: 24 }}
          extra={
            <Button 
              type="link" 
              onClick={() => setResult(null)}
            >
              关闭
            </Button>
          }
        >
          <div style={{ marginBottom: 16 }}>
            <strong>URL:</strong> {result.url}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>检测时间:</strong> {result.time}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>检测结果:</strong> 
            {result.result === '安全' ? 
              <Tag color="green">安全</Tag> : 
              result.result === '可疑' ? 
              <Tag color="orange">可疑</Tag> : 
              <Tag color="red">钓鱼网站</Tag>
            }
          </div>
          <div>
            <strong>详细信息:</strong>
            <p style={{ marginTop: 8, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              {result.details}
            </p>
          </div>
          {result.result !== '安全' && (
            <Alert
              message="安全建议"
              description="不要点击该链接，不要输入任何个人信息，如已点击请立即修改相关密码。"
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Card>
      )}

      {/* 历史检测记录 */}
      <Card title="历史检测记录">
        <Table 
          dataSource={history} 
          columns={columns} 
          pagination={{ pageSize: 10 }} 
          scroll={{ x: 600 }} 
        />
      </Card>
    </div>
  );
};

export default UrlDetection;