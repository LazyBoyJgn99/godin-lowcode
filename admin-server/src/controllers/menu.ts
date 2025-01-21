import { Request, Response } from 'express';
import { MenuService } from '../services/menu';
import { MenuCreateInput, MenuUpdateInput, MenuBatchSortInput } from '../types/menu';

const menuService = new MenuService();

export class MenuController {
  // 创建菜单
  async create(req: Request, res: Response) {
    console.log("create",req);
    try {
      const data = req.body as MenuCreateInput;
      const result = await menuService.create(req.tenant.id, data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 获取菜单树
  async getTree(req: Request, res: Response) {
    try {
      const tree = await menuService.getMenuTree(req.tenant.id);
      res.status(200).json({ menus: tree });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 更新菜单
  async update(req: Request, res: Response) {
    try {
      const data = req.body as MenuUpdateInput;
      const result = await menuService.update(req.tenant.id, req.params.id, data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 删除菜单
  async delete(req: Request, res: Response) {
    try {
      await menuService.delete(req.tenant.id, req.params.id);
      res.status(200).json({ message: 'Menu deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // 批量更新菜单排序
  async batchUpdateSort(req: Request, res: Response) {
    try {
      const data = req.body as MenuBatchSortInput;
      await menuService.batchUpdateSort(req.tenant.id, data);
      res.status(200).json({ message: 'Menu sort updated successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
} 