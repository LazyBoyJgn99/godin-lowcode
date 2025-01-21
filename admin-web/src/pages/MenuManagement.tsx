import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, TreeSelect, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuItem } from '../types';
import { getMenuTree, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/menu';
import { getPages } from '../services/page';
import type { Page } from '../services/page';

const MenuManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await getMenuTree();  // 假设当前租户ID为'current'
      setMenuItems(response.data.menus);
    } catch (error) {
      message.error('获取菜单列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await getPages();
      setPages(response.data.pages);
    } catch (error) {
      message.error('获取页面列表失败');
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchPages();
  }, []);

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '页面名称',
      dataIndex: 'pageId',
      key: 'pageId',
      render: (pageId: string) => {
        const page = pages.find(p => p.id === pageId);
        return page ? page.title : '-';
      }
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MenuItem) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue({
                ...record,
                parentId: record.parentId || undefined
              });
              setVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, values);
        message.success('编辑成功');
      } else {
        await createMenuItem(values);
        message.success('添加成功');
      }
      setVisible(false);
      form.resetFields();
      setEditingItem(null);
      fetchMenus();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (record: MenuItem) => {
    try {
      await deleteMenuItem(record.id);
      message.success('删除成功');
      fetchMenus();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const treeData = menuItems.map(item => ({
    title: item.name,
    value: item.id,
    key: item.id,
  }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingItem(null);
            form.resetFields();
            setVisible(true);
          }}
        >
          新增菜单
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={menuItems}
        rowKey="id"
      />

      <Modal
        title={editingItem ? '编辑菜单' : '新增菜单'}
        open={visible}
        onOk={() => form.submit()}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setEditingItem(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>

          <Form.Item
            name="path"
            label="路径"
            rules={[{ required: true, message: '请输入路径' }]}
          >
            <Input placeholder="请输入路径" />
          </Form.Item>

          <Form.Item
            name="pageId"
            label="关联页面"
          >
            <Select
              allowClear
              placeholder="请选择关联页面"
              options={pages.map(page => ({
                label: page.title,
                value: page.id
              }))}
            />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="父级菜单"
          >
            <TreeSelect
              treeData={treeData}
              placeholder="请选择父级菜单"
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="order"
            label="排序"
            rules={[{ required: true, message: '请输入排序号' }]}
          >
            <Input type="number" placeholder="请输入排序号" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuManagement; 