import http from './http';
import type { MenuItem } from '../types';

interface CreateMenuParams {
  name: string;
  path: string;
  parentId?: string;
  icon?: string;
  order: number;
}

interface UpdateMenuParams extends Partial<CreateMenuParams> {}

interface UpdateMenuOrderParams {
  orders: Array<{
    menuId: string;
    order: number;
  }>;
}

export const getMenuTree = async () => {
  // TODO: 实现获取菜单树接口
  return http.get(`/menus`);
};

export const createMenuItem = async (params: CreateMenuParams) => {
  // TODO: 实现创建菜单项接口
  return http.post(`/menus`, params);
};

export const updateMenuItem = async (menuId: string, params: UpdateMenuParams) => {
  // TODO: 实现更新菜单项接口
  return http.put(`/menus/${menuId}`, params);
};

export const deleteMenuItem = async (menuId: string) => {
  // TODO: 实现删除菜单项接口
  return http.delete(`/menus/${menuId}`);
};

export const updateMenuOrder = async (params: UpdateMenuOrderParams) => {
  // TODO: 实现更新菜单排序接口
  return http.put(`/menus/order`, params);
}; 