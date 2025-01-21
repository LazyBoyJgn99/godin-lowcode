import { PrismaClient } from '@prisma/client';
import { MenuCreateInput, MenuUpdateInput, MenuTreeItem, MenuBatchSortInput } from '../types/menu';

const prisma = new PrismaClient();

export class MenuService {
  // 创建菜单
  async create(tenantId: string, data: MenuCreateInput) {
    // 如果没有指定排序号，获取同级菜单中的最大排序号+1
    if (data.sort === undefined) {
      const maxSort = await prisma.menu.findFirst({
        where: {
          tenantId,
          parentId: data.parentId || null
        },
        orderBy: {
          sort: 'desc'
        },
        select: {
          sort: true
        }
      });
      data.sort = (maxSort?.sort || 0) + 1;
    }

    // 创建菜单
    return await prisma.menu.create({
      data: {
        name: data.name,
        path: data.path,
        icon: data.icon,
        sort: data.sort,
        parentId: data.parentId,
        pageId: data.pageId,
        tenantId
      },
      include: {
        page: true
      }
    });
  }

  // 更新菜单
  async update(tenantId: string, id: string, data: MenuUpdateInput) {
    // 检查菜单是否存在
    const menu = await this.findMenuById(tenantId, id);
    if (!menu) {
      throw new Error('Menu not found');
    }

    // 更新菜单
    return await prisma.menu.update({
      where: { id },
      data: {
        name: data.name,
        path: data.path,
        icon: data.icon,
        sort: data.sort,
        parentId: data.parentId,
        pageId: data.pageId
      },
      include: {
        page: true
      }
    });
  }

  // 删除菜单
  async delete(tenantId: string, id: string) {
    // 检查菜单是否存在
    const menu = await this.findMenuById(tenantId, id);
    if (!menu) {
      throw new Error('Menu not found');
    }

    // 递归删除所有子菜单
    await this.deleteMenuWithChildren(id);
  }

  // 获取菜单树
  async getMenuTree(tenantId: string): Promise<MenuTreeItem[]> {
    // 获取所有菜单
    const menus = await prisma.menu.findMany({
      where: {
        tenantId
      },
      include: {
        page: true
      },
      orderBy: {
        sort: 'asc'
      }
    });

    // 构建菜单树
    return this.buildMenuTree(menus);
  }

  // 批量更新菜单排序
  async batchUpdateSort(tenantId: string, data: MenuBatchSortInput) {
    const { items } = data;

    // 验证所有菜单是否属于当前租户
    for (const item of items) {
      const menu = await this.findMenuById(tenantId, item.id);
      if (!menu) {
        throw new Error(`Menu not found: ${item.id}`);
      }
    }

    // 批量更新排序
    await Promise.all(
      items.map(item =>
        prisma.menu.update({
          where: { id: item.id },
          data: { sort: item.sort }
        })
      )
    );
  }

  // 私有方法：根据ID查找菜单
  private async findMenuById(tenantId: string, id: string) {
    return await prisma.menu.findFirst({
      where: {
        id,
        tenantId
      }
    });
  }

  // 私有方法：递归删除菜单及其子菜单
  private async deleteMenuWithChildren(menuId: string) {
    // 获取所有子菜单
    const children = await prisma.menu.findMany({
      where: {
        parentId: menuId
      }
    });

    // 递归删除子菜单
    for (const child of children) {
      await this.deleteMenuWithChildren(child.id);
    }

    // 删除当前菜单
    await prisma.menu.delete({
      where: { id: menuId }
    });
  }

  // 私有方法：构建菜单树
  private buildMenuTree(menus: any[]): MenuTreeItem[] {
    // 创建一个映射表，用于快速查找菜单
    const menuMap = new Map();
    menus.forEach(menu => {
      menuMap.set(menu.id, {
        ...menu,
        buildPath: menu.page?.buildPath || null,
        children: []
      });
    });

    const tree: MenuTreeItem[] = [];

    // 构建树状结构
    menus.forEach(menu => {
      const menuWithChildren = menuMap.get(menu.id);
      if (menu.parentId === null) {
        tree.push(menuWithChildren);
      } else {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children.push(menuWithChildren);
        }
      }
    });

    // 对每一层级的菜单按sort排序
    const sortMenus = (items: MenuTreeItem[]) => {
      items.sort((a, b) => a.sort - b.sort);
      items.forEach(item => {
        if (item.children.length > 0) {
          sortMenus(item.children);
        }
      });
    };
    sortMenus(tree);

    return tree;
  }
} 