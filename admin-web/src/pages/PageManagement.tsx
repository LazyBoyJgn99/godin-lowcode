import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
  Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Page,
  CreatePageDto,
  UpdatePageDto,
  getPages,
  createPage,
  updatePage,
  deletePage,
} from '../services/page';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const PageManagement: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [form] = Form.useForm();

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await getPages();
      setPages(response.data.pages);
    } catch (error) {
      message.error('获取页面列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreate = async (values: CreatePageDto) => {
    try {
      await createPage(values);
      message.success('创建页面成功');
      setModalVisible(false);
      form.resetFields();
      fetchPages();
    } catch (error) {
      message.error('创建页面失败');
    }
  };

  const handleUpdate = async (values: UpdatePageDto) => {
    if (!editingPage) return;
    try {
      await updatePage(editingPage.id, values);
      message.success('更新页面成功');
      setModalVisible(false);
      setEditingPage(null);
      form.resetFields();
      fetchPages();
    } catch (error) {
      message.error('更新页面失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePage(id);
      message.success('删除页面成功');
      fetchPages();
    } catch (error) {
      message.error('删除页面失败');
    }
  };

  const columns: ColumnsType<Page> = [
    {
      title: '页面名称',
      dataIndex: 'pageName',
      key: 'pageName',
    },
    {
      title: '页面标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={status === 'published' ? 'success' : 'warning'}
          text={status === 'published' ? '已发布' : '草稿'}
        />
      ),
    },
    {
      title: '构建路径',
      dataIndex: 'buildPath',
      key: 'buildPath',
      render: (text: string) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/admin/page-creator/${record.id}`)}
          >
            设计
          </Button>
          <Button
            type="link"
            onClick={() => {
              setEditingPage(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该页面吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingPage) {
        handleUpdate(values);
      } else {
        handleCreate(values);
      }
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingPage(null);
    form.resetFields();
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">页面管理</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingPage(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          创建页面
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={pages}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingPage ? '编辑页面' : '创建页面'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="pageName"
            label="页面名称"
            rules={[
              { required: true, message: '请输入页面名称' },
              { pattern: /^[a-z0-9-]+$/, message: '页面名称只能包含小写字母、数字和连字符' },
            ]}
          >
            <Input placeholder="请输入页面名称，例如：user-list" />
          </Form.Item>

          <Form.Item
            name="title"
            label="页面标题"
            rules={[{ required: true, message: '请输入页面标题' }]}
          >
            <Input placeholder="请输入页面标题，例如：用户列表" />
          </Form.Item>

          <Form.Item
            name="status"
            label="页面状态"
            initialValue="draft"
          >
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="published">发布</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="页面内容"
            extra="可选，JSON格式的页面配置"
          >
            <TextArea
              rows={4}
              placeholder="请输入页面内容（JSON格式）"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PageManagement; 