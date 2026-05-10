import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Button, Select, DatePicker, Space, message } from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Reports = () => {
  const pieRef = useRef(null);
  const lineRef = useRef(null);
  const barRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!pieRef.current || !lineRef.current || !barRef.current) return;

    const pieChart = echarts.init(pieRef.current);
    const lineChart = echarts.init(lineRef.current);
    const barChart = echarts.init(barRef.current);

    pieChart.setOption({
      backgroundColor: 'transparent',
      title: { text: '检测结果分布', left: 'center' },
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', left: 'left', data: ['安全', '可疑', '钓鱼'] },
      series: [{
        type: 'pie',
        radius: '50%',
        center: ['55%', '50%'],
        data: [
          { value: 650, name: '安全', itemStyle: { color: '#52c41a' } },
          { value: 320, name: '可疑', itemStyle: { color: '#faad14' } },
          { value: 234, name: '钓鱼', itemStyle: { color: '#ff4d4f' } }
        ]
      }]
    });

    lineChart.setOption({
      backgroundColor: 'transparent',
      title: { text: '检测趋势', left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['安全', '可疑', '钓鱼'], bottom: 0 },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value' },
      series: [
        { name: '安全', type: 'line', data: [120, 132, 101, 134, 90, 230], smooth: true, lineStyle: { color: '#52c41a' } },
        { name: '可疑', type: 'line', data: [220, 182, 191, 234, 290, 330], smooth: true, lineStyle: { color: '#faad14' } },
        { name: '钓鱼', type: 'line', data: [150, 232, 201, 154, 190, 330], smooth: true, lineStyle: { color: '#ff4d4f' } }
      ]
    });

    barChart.setOption({
      backgroundColor: 'transparent',
      title: { text: '演练效果分析', left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['参与人数', '完成人数'], bottom: 0 },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: { type: 'category', data: ['邮件钓鱼', 'URL钓鱼', '综合培训'] },
      yAxis: { type: 'value' },
      series: [
        { name: '参与人数', type: 'bar', data: [256, 189, 150], itemStyle: { color: '#1890ff' } },
        { name: '完成人数', type: 'bar', data: [166, 174, 0], itemStyle: { color: '#52c41a' } }
      ]
    });

    fetch('http://localhost:8000/api/detection/detection-history/')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success' && data.data && data.data.length > 0) {
          const history = data.data;
          const safeCount = history.filter(item => !item.is_phishing).length;
          const phishingCount = history.filter(item => item.is_phishing).length;
          
          pieChart.setOption({
            series: [{
              data: [
                { value: safeCount || 650, name: '安全', itemStyle: { color: '#52c41a' } },
                { value: Math.floor(phishingCount * 0.3) || 320, name: '可疑', itemStyle: { color: '#faad14' } },
                { value: phishingCount || 234, name: '钓鱼', itemStyle: { color: '#ff4d4f' } }
              ]
            }]
          });
        }
      })
      .catch(error => {
        console.error('获取数据失败:', error);
      });

    const handleResize = () => {
      pieChart.resize();
      lineChart.resize();
      barChart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      pieChart.dispose();
      lineChart.dispose();
      barChart.dispose();
    };
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    message.success('数据刷新成功');
  };

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <span>时间范围:</span>
            <RangePicker style={{ width: 300 }} />
          </Space>
          <Space>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部类型</Option>
              <Option value="url">URL检测</Option>
              <Option value="email">邮件分析</Option>
              <Option value="training">宣教演练</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
            <Button type="primary" icon={<DownloadOutlined />}>导出报表</Button>
          </Space>
        </Space>
      </Card>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="检测结果分布" style={{ height: 400 }}>
            <div ref={pieRef} style={{ width: '100%', height: 320 }} />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="检测趋势" style={{ height: 400 }}>
            <div ref={lineRef} style={{ width: '100%', height: 320 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="演练效果分析">
            <div ref={barRef} style={{ width: '100%', height: 400 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;