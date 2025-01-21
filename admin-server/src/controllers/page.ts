import { Request, Response } from 'express';
import { PageService } from '../services/page';
import { PageCreateInput, PageUpdateInput } from '../types/page';

const pageService = new PageService();

export class PageController {
  // 创建页面
  async create(req: Request, res: Response) {
    try {
      const data = req.body as PageCreateInput;
      const result = await pageService.create(req.tenant.id, data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 获取页面列表
  async list(req: Request, res: Response) {
    try {
      const pages = await pageService.list(req.tenant.id);
      res.status(200).json({ pages });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 获取页面详情
  async getById(req: Request, res: Response) {
    try {
      const page = await pageService.getById(req.tenant.id, req.params.id);
      res.status(200).json(page);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // 更新页面
  async update(req: Request, res: Response) {
    try {
      const data = req.body as PageUpdateInput;
      const result = await pageService.update(req.tenant.id, req.params.id, data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 删除页面
  async delete(req: Request, res: Response) {
    try {
      await pageService.delete(req.tenant.id, req.params.id);
      res.status(200).json({ message: 'Page deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
} 