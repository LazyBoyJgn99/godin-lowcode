import { request } from './http';

export interface MenuTreeItem {
  pageName?: string;
  name: string;
  children?: MenuTreeItem[];
}

export interface MenuTreeResponse {
  menus: MenuTreeItem[];
}

export const getMenuTree = async (tenantId: string): Promise<MenuTreeResponse> => {
  return request(`/api/menu/tree/${tenantId}`);
}; 