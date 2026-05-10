import React, { useState } from 'react';
import { Card, Input, Button, List, Tag, Space, Select, Pagination, Modal } from 'antd';
import { SearchOutlined, BookOutlined, StarOutlined } from '@ant-design/icons';

const { Option } = Select;

const KnowledgeBase = () => {
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleModalVisible, setIsArticleModalVisible] = useState(false);
  
  // 模拟知识库数据
  const articles = [
    {
      id: '1',
      title: '如何识别钓鱼邮件',
      category: '邮件安全',
      categoryTag: <Tag color="blue">邮件安全</Tag>,
      author: '安全专家',
      date: '2026-04-20',
      views: 1250,
      content: '本文介绍了如何识别钓鱼邮件的方法，包括检查发件人地址、邮件内容、链接等。',
      isFavorite: true
    },
    {
      id: '2',
      title: '常见URL钓鱼手法分析',
      category: 'URL安全',
      categoryTag: <Tag color="green">URL安全</Tag>,
      author: '网络安全团队',
      date: '2026-04-18',
      views: 980,
      content: '本文分析了常见的URL钓鱼手法，包括域名欺骗、短链接等，并提供了相应的防范措施。',
      isFavorite: false
    },
    {
      id: '3',
      title: '高校师生安全意识培训指南',
      category: '安全培训',
      categoryTag: <Tag color="orange">安全培训</Tag>,
      author: '信息安全中心',
      date: '2026-04-15',
      views: 1560,
      content: '本文为高校师生提供了安全意识培训的指南，包括常见安全威胁、防范措施等。',
      isFavorite: true
    },
    {
      id: '4',
      title: '密码安全最佳实践',
      category: '账户安全',
      categoryTag: <Tag color="red">账户安全</Tag>,
      author: '安全专家',
      date: '2026-04-10',
      views: 2100,
      content: '本文介绍了密码安全的最佳实践，包括密码长度、复杂度、定期更换等。',
      isFavorite: false
    },
    {
      id: '5',
      title: '社会工程学攻击防范',
      category: '综合安全',
      categoryTag: <Tag color="purple">综合安全</Tag>,
      author: '网络安全团队',
      date: '2026-04-05',
      views: 1350,
      content: '本文介绍了社会工程学攻击的常见手法和防范措施，帮助师生提高安全意识。',
      isFavorite: false
    },
    {
      id: '6',
      title: '如何安全使用公共WiFi',
      category: '网络安全',
      categoryTag: <Tag color="cyan">网络安全</Tag>,
      author: '信息安全中心',
      date: '2026-03-30',
      views: 1890,
      content: '本文介绍了在使用公共WiFi时的安全注意事项，包括避免敏感操作、使用VPN等。',
      isFavorite: true
    }
  ];

  // 筛选文章
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchText.toLowerCase()) || 
                         article.content.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = category === 'all' || article.category === category;
    return matchesSearch && matchesCategory;
  });

  // 处理搜索输入
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理分类选择
  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理文章阅读
  const handleReadArticle = (article) => {
    setSelectedArticle(article);
    setIsArticleModalVisible(true);
  };

  // 关闭文章模态框
  const handleCloseArticleModal = () => {
    setSelectedArticle(null);
    setIsArticleModalVisible(false);
  };

  // 分页
  const pageSize = 3;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <div>
      {/* 搜索和分类筛选 */}
      <Card style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input
            placeholder="搜索文章"
            value={searchText}
            onChange={handleSearch}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Select 
            defaultValue="all" 
            style={{ width: 150 }}
            onChange={handleCategoryChange}
          >
            <Option value="all">全部分类</Option>
            <Option value="邮件安全">邮件安全</Option>
            <Option value="URL安全">URL安全</Option>
            <Option value="账户安全">账户安全</Option>
            <Option value="网络安全">网络安全</Option>
            <Option value="安全培训">安全培训</Option>
            <Option value="综合安全">综合安全</Option>
          </Select>
        </Space>
      </Card>

      {/* 文章列表 */}
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={paginatedArticles}
        renderItem={item => (
          <List.Item>
            <Card 
              title={
                <Space>
                  <BookOutlined />
                  {item.title}
                  <Tag color={item.isFavorite ? "yellow" : "default"} icon={<StarOutlined />}>
                    {item.isFavorite ? "已收藏" : "收藏"}
                  </Tag>
                </Space>
              }
              extra={item.categoryTag}
            >
              <div style={{ marginBottom: 8 }}>
                <span style={{ marginRight: 16 }}>作者: {item.author}</span>
                <span style={{ marginRight: 16 }}>发布日期: {item.date}</span>
                <span>浏览量: {item.views}</span>
              </div>
              <p style={{ marginBottom: 16 }}>{item.content}</p>
              <Button type="link" onClick={() => handleReadArticle(item)}>阅读全文</Button>
            </Card>
          </List.Item>
        )}
      />

      {/* 分页 */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredArticles.length}
          onChange={setCurrentPage}
        />
      </div>

      {/* 文章详情模态框 */}
      <Modal
        title={selectedArticle?.title}
        open={isArticleModalVisible}
        onCancel={handleCloseArticleModal}
        footer={[
          <Button key="close" onClick={handleCloseArticleModal}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedArticle && (
          <div>
            <Space style={{ marginBottom: 16 }}>
              <span>作者: {selectedArticle.author}</span>
              <span>发布日期: {selectedArticle.date}</span>
              <span>浏览量: {selectedArticle.views}</span>
            </Space>
            <div style={{ marginBottom: 16 }}>
              {selectedArticle.categoryTag}
            </div>
            <div style={{ 
              lineHeight: 1.8, 
              fontSize: 16,
              color: '#333'
            }}>
              <p style={{ marginBottom: 16 }}>
                {selectedArticle.content}
              </p>
              <p>
                本文详细介绍了{selectedArticle.title}的相关知识，帮助读者了解和掌握相关技能。
                通过学习本文，您将能够更好地理解{selectedArticle.category}的重要性，
                并在实际应用中采取相应的防护措施。
              </p>
              <p>
                在日常生活中，我们需要时刻保持警惕，提高安全意识。
                特别是在网络环境中，要特别注意保护个人信息，避免遭受网络攻击。
              </p>
              <p>
                建议定期关注安全知识库的更新，及时了解最新的安全威胁和防护措施。
                同时，积极参加学校组织的安全培训活动，不断提升自己的安全防护能力。
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KnowledgeBase;