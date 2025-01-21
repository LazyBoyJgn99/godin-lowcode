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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Api,
  CreateApiDto,
  UpdateApiDto,
  getApis,
  createApi,
  updateApi,
  deleteApi,
} from '../services/api';

const { Option } = Select;

const ApiManagement: React.FC = () => {
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingApi, setEditingApi] = useState<Api | null>(null);
  const [form] = Form.useForm();

  const fetchApis = async () => {
    try {
      setLoading(true);
      const response = await getApis();
      setApis(response.data.apis);
    } catch (error) {
      message.error('获取API列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  const handleCreate = async (values: CreateApiDto) => {
    try {
      await createApi(values);
      message.success('创建API成功');
      setModalVisible(false);
      form.resetFields();
      fetchApis();
    } catch (error) {
      message.error('创建API失败');
    }
  };

  const handleUpdate = async (values: UpdateApiDto) => {
    if (!editingApi) return;
    try {
      await updateApi(editingApi.id, values);
      message.success('更新API成功');
      setModalVisible(false);
      setEditingApi(null);
      form.resetFields();
      fetchApis();
    } catch (error) {
      message.error('更新API失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApi(id);
      message.success('删除API成功');
      fetchApis();
    } catch (error) {
      message.error('删除API失败');
    }
  };

  const columns: ColumnsType<Api> = [
    {
      title: 'API名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'API路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '目标URL',
      dataIndex: 'targetUrl',
      key: 'targetUrl',
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
            onClick={() => {
              setEditingApi(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该API吗？"
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
      if (editingApi) {
        handleUpdate(values);
      } else {
        handleCreate(values);
      }
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingApi(null);
    form.resetFields();
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">API管理</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingApi(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          创建API
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={apis}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingApi ? '编辑API' : '创建API'}
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
            name="name"
            label="API名称"
            rules={[{ required: true, message: '请输入API名称' }]}
          >
            <Input placeholder="请输入API名称" />
          </Form.Item>

          <Form.Item
            name="method"
            label="请求方法"
            rules={[{ required: true, message: '请选择请求方法' }]}
          >
            <Select placeholder="请选择请求方法">
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PUT">PUT</Option>
              <Option value="DELETE">DELETE</Option>
              <Option value="PATCH">PATCH</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="path"
            label="API路径"
            rules={[{ required: true, message: '请输入API路径' }]}
          >
            <Input placeholder="请输入API路径，例如：/api/users" />
          </Form.Item>

          <Form.Item
            name="targetUrl"
            label="目标URL"
            rules={[{ required: true, message: '请输入目标URL' }]}
          >
            <Input placeholder="请输入目标URL，例如：http://api.example.com/users" />
          </Form.Item>

          {/* TODO: 添加参数配置和请求头配置的表单项 */}
        </Form>
      </Modal>
    </div>
  );
};

export default ApiManagement; 