import React, { useState } from 'react';
import { Card, Input, Button, Table, Tag, Alert, Space, Divider, Spin, Select, Upload, message } from 'antd';
import { MailOutlined, FileTextOutlined, LoadingOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const EmailAnalysis = () => {
  const [emailHeader, setEmailHeader] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([
    {
      key: '1',
      subject: '重要：您的账户需要验证',
      sender: 'support@university.edu.cn',
      result: '安全',
      resultTag: <Tag color="green">安全</Tag>,
      time: '2026-04-21 10:30',
      details: '邮件头信息完整，来源合法'
    },
    {
      key: '2',
      subject: '您的邮箱将被停用',
      sender: 'admin@univeristy.edu.cn',
      result: '钓鱼邮件',
      resultTag: <Tag color="red">钓鱼邮件</Tag>,
      time: '2026-04-21 09:15',
      details: '发件人域名拼写错误，存在钓鱼风险'
    },
    {
      key: '3',
      subject: '成绩查询通知',
      sender: 'student@university.edu.cn',
      result: '可疑',
      resultTag: <Tag color="orange">可疑</Tag>,
      time: '2026-04-21 08:45',
      details: '邮件头包含可疑IP地址'
    }
  ]);

  const loadExample = () => {
    const example = `From: "官方客服 <service@bank-official.com>" <fake-bank@163.com>
To: user@qq.com
Date: Mon, 12 May 2026 09:23:15 +0100
Subject: 【账户安全】请尽快验证账户信息避免冻结
Message-ID: <20260512082315.38927.15987@unknown-localhost>
X-Mailer: PHP/7.2.34
Received: from localhost (103.42.xx.xx)
	by mx.qq.com with ESMTP id 8F29D671;
	Mon, 12 May 2026 16:23:12 +0800
X-Originating-IP: 103.42.xx.xx`;
    setEmailHeader(example);
    message.info('已加载示例邮件头');
  };

  const handleAnalyze = () => {
    if (!emailHeader) {
      message.error('请输入邮件头信息');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const warnings = [];
      let confidence = 0;

      // 1. 检查主题中的可疑关键词
      const subjectMatch = emailHeader.match(/Subject: (.+)/i);
      const subject = subjectMatch ? subjectMatch[1].trim() : '';
      const suspiciousKeywords = ['紧急', '密码', '账户', '验证', '安全', '冻结', '警告', '重要', '激活', '更新', '确认', '异常', '登录', '注意'];
      const foundKeywords = suspiciousKeywords.filter(kw => subject.includes(kw));
      if (foundKeywords.length > 0) {
        warnings.push(`邮件主题包含可疑关键词: ${foundKeywords.join(', ')}`);
        confidence += Math.min(foundKeywords.length * 15, 30);
      }

      // 2. 检查 DKIM/SPF/DMARC
      if (!emailHeader.includes('DKIM') && !emailHeader.includes('dkim')) {
        warnings.push('邮件缺少DKIM签名验证');
        confidence += 15;
      }
      if (!emailHeader.includes('SPF') && !emailHeader.includes('spf')) {
        warnings.push('邮件缺少SPF验证');
        confidence += 15;
      }
      if (!emailHeader.includes('DMARC') && !emailHeader.includes('dmarc')) {
        warnings.push('邮件缺少DMARC验证');
        confidence += 10;
      }

      // 3. 检查发件人信息
      const fromMatch = emailHeader.match(/From:.*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
      const fromEmail = fromMatch ? fromMatch[1].toLowerCase() : '';
      
      // 检查显示名称与邮箱不匹配
      const displayNameMatch = emailHeader.match(/From:\s*"?([^<"]+)"?\s*</i);
      if (displayNameMatch && fromEmail) {
        const displayName = displayNameMatch[1].toLowerCase();
        const bankNames = ['银行', 'bank', 'pay', 'alipay', 'taobao', 'jd', '腾讯', '微信', 'wechat', 'qq', '支付宝'];
        const hasBankInName = bankNames.some(bank => displayName.includes(bank));
        const hasBankInEmail = bankNames.some(bank => fromEmail.includes(bank));
        if (hasBankInName && !hasBankInEmail) {
          warnings.push('显示名称与发件邮箱不匹配，可能是伪造邮件');
          confidence += 35;
        }
      }

      // 4. 检查常见钓鱼域名模式
      const phishingDomains = ['@univeristy.', '@unversity.', '@qq.c0m', '@163.c0m', '@outl00k.', '@micr0soft.', '@paypai.'];
      for (const domain of phishingDomains) {
        if (emailHeader.toLowerCase().includes(domain)) {
          warnings.push(`发现可疑域名模式: ${domain}`);
          confidence += 25;
          break;
        }
      }

      // 5. 检查 IP 地址而不是域名
      const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
      const ips = emailHeader.match(ipPattern);
      if (ips && ips.length > 0) {
        warnings.push(`邮件头包含 IP 地址，可能是伪装邮件`);
        confidence += 20;
      }

      // 6. 检查 X-Originating-IP/Received 中的异常
      const originatingIpMatch = emailHeader.match(/X-Originating-IP:\s*\[?([\d.]+)\]?/i);
      if (originatingIpMatch) {
        warnings.push(`发现原始发送 IP: ${originatingIpMatch[1]}`);
        confidence += 15;
      }

      // 7. 检查 Received 头中的多个服务器跳转
      const receivedCount = (emailHeader.match(/Received:/gi) || []).length;
      if (receivedCount > 5) {
        warnings.push(`邮件经过 ${receivedCount} 个服务器转发，可能存在异常`);
        confidence += 10;
      }

      // 8. 检查免费邮箱伪装成官方机构
      const freeEmailDomains = ['@qq.com', '@163.com', '@126.com', '@gmail.com', '@outlook.com', '@yahoo.com', '@hotmail.com'];
      const officialKeywords = ['admin', 'support', 'official', 'service', 'help', 'info', 'noreply', 'system'];
      if (fromEmail) {
        const isFreeEmail = freeEmailDomains.some(domain => fromEmail.endsWith(domain));
        const looksOfficial = officialKeywords.some(keyword => fromEmail.includes(keyword));
        if (isFreeEmail && looksOfficial) {
          warnings.push('使用免费邮箱伪装成官方服务');
          confidence += 30;
        }
      }

      // 9. 检查邮件头格式异常
      if (emailHeader.includes('@') && emailHeader.includes('@') && fromEmail) {
        // 检查多个 @ 符号的异常
        const atCount = (fromEmail.match(/@/g) || []).length;
        if (atCount > 1) {
          warnings.push('发件邮箱包含多个 @ 符号，格式异常');
          confidence += 25;
        }
      }

      // 10. 检查是否有明显的显示邮箱与真实邮箱不一致
      const fromDisplayMatch = emailHeader.match(/From:\s*"?([^<"]+)"?\s*<([^>]+)>/i);
      if (fromDisplayMatch) {
        const displayEmail = fromDisplayMatch[1];
        const realEmail = fromDisplayMatch[2];
        if (displayEmail.includes('@') && !displayEmail.includes(realEmail)) {
          warnings.push('显示邮箱与真实邮箱不一致，可能是伪造');
          confidence += 35;
        }
      }

      // 根据置信度判定结果
      const isPhishing = confidence >= 50;
      const finalResult = isPhishing ? '钓鱼邮件' : confidence >= 30 ? '可疑' : '安全';
      const details = warnings.length > 0 ? warnings.join('；') : '邮件头信息完整，来源合法';

      const newResult = {
        subject: subject || '未知主题',
        sender: fromEmail || '未知发件人',
        result: finalResult,
        time: new Date().toLocaleString(),
        details: details,
        warnings: warnings,
        confidence: Math.min(confidence, 100),
        isPhishing: isPhishing
      };
      
      setResult(newResult);
      setHistory([
        {
          key: Date.now().toString(),
          subject: newResult.subject,
          sender: newResult.sender,
          result: newResult.result,
          resultTag: newResult.result === '安全' ?
            <Tag color="green">安全</Tag> :
            newResult.result === '可疑' ?
            <Tag color="orange">可疑</Tag> :
            <Tag color="red">钓鱼邮件</Tag>,
          time: newResult.time,
          details: newResult.details,
          isPhishing: newResult.isPhishing,
          confidence: newResult.confidence,
          warnings: newResult.warnings
        },
        ...history
      ]);
      setLoading(false);
      message.success('分析完成');
    }, 1000);
  };

  const columns = [
    {
      title: '主题',
      dataIndex: 'subject',
      key: 'subject',
      width: 200
    },
    {
      title: '发件人',
      dataIndex: 'sender',
      key: 'sender',
      width: 200
    },
    {
      title: '分析结果',
      dataIndex: 'resultTag',
      key: 'result',
      width: 120
    },
    {
      title: '分析时间',
      dataIndex: 'time',
      key: 'time',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button size="small" onClick={() => setResult({
          subject: record.subject,
          sender: record.sender,
          result: record.result,
          time: record.time,
          details: record.details,
          isPhishing: record.isPhishing,
          confidence: record.confidence,
          warnings: record.warnings || []
        })}>
          查看详情
        </Button>
      )
    }
  ];

  return (
    <div>
      <Card title="邮件头分析" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <TextArea
            rows={10}
            placeholder="请输入邮件头信息"
            value={emailHeader}
            onChange={(e) => setEmailHeader(e.target.value)}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#666', fontSize: '12px' }}>
              示例: From: sender@example.com\nTo: recipient@example.com\nSubject: Test\nDate: ...
            </div>
            <Space>
              <Button onClick={loadExample}>
                加载示例
              </Button>
              <Button
                type="primary"
                onClick={handleAnalyze}
                loading={loading}
              >
                分析
              </Button>
            </Space>
          </div>
        </Space>
      </Card>

      {loading && (
        <div className="loading-container">
          <Spin size="large" tip="正在分析中..." />
        </div>
      )}

      {result && (
        <Card
          title="分析结果"
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
            <strong>主题:</strong> {result.subject}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>发件人:</strong> {result.sender}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>分析时间:</strong> {result.time}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>分析结果:</strong>
            {result.result === '安全' ?
              <Tag color="green">安全</Tag> :
              result.result === '可疑' ?
              <Tag color="orange">可疑</Tag> :
              <Tag color="red">钓鱼邮件</Tag>
            }
            <span style={{ marginLeft: 16 }}>钓鱼概率: {result.confidence}%</span>
          </div>
          {result.warnings && result.warnings.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <strong>检测到的问题:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                {result.warnings.map((w, i) => (
                  <li key={i} style={{ color: '#ff4d4f' }}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <strong>详细信息:</strong>
            <p style={{ marginTop: 8, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              {result.details}
            </p>
          </div>
          {result.result !== '安全' && (
            <Alert
              message="安全建议"
              description="不要点击邮件中的链接，不要下载附件，不要回复邮件，如已操作请立即修改相关密码。"
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Card>
      )}

      <Card title="历史分析记录">
        <Table
          columns={columns}
          dataSource={history}
          pagination={{ pageSize: 10 }}
          rowKey="key"
        />
      </Card>
    </div>
  );
};

export default EmailAnalysis;