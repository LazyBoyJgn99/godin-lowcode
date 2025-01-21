import { Menu } from '@prisma/client';

export type MenuCreateInput = {
  name: string;       // 菜单名称
  path?: string;      // 菜单路径
  icon?: string;      // 菜单图标
  sort?: number;      // 排序序号
  parentId?: string;  // 父菜单ID
  pageId?: string;    // 关联的页面ID
};

export type MenuUpdateInput = Partial<MenuCreateInput>;

export type MenuSortItem = {
  id: string;
  sort: number;
};

export type MenuBatchSortInput = {
  items: MenuSortItem[];
};

export type MenuTreeItem = {
  id: string;
  name: string;
  path: string | null;
  icon: string | null;
  sort: number;
  parentId: string | null;
  pageId: string | null;
  buildPath?: string | null;  // 页面构建产物路径
  children: MenuTreeItem[];
  createdAt: Date;
  updatedAt: Date;
}; 