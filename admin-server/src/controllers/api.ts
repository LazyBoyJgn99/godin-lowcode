import { Request, Response } from 'express';
import { ApiService } from '../services/api';
import { ApiCreateInput, ApiUpdateInput } from '../types/api';

const apiService = new ApiService();

export class ApiController {
  // 创建API
  async create(req: Request, res: Response) {
    try {
      const data = req.body as ApiCreateInput;
      
      // 检查API名称是否已存在
      const exists = await apiService.checkNameExists(req.tenant.id, data.name);
      if (exists) {
        return res.status(400).json({ message: 'API name already exists' });
      }

      const result = await apiService.create(req.tenant.id, data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 获取API列表
  async list(req: Request, res: Response) {
    try {
      const apis = await apiService.list(req.tenant.id);
      res.status(200).json({ apis });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 获取API详情
  async getById(req: Request, res: Response) {
    try {
      const api = await apiService.getById(req.tenant.id, req.params.id);
      res.status(200).json(api);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // 更新API
  async update(req: Request, res: Response) {
    try {
      const data = req.body as ApiUpdateInput;
      
      // 如果要更新名称，检查新名称是否已存在
      if (data.name) {
        const exists = await apiService.checkNameExists(req.tenant.id, data.name, req.params.id);
        if (exists) {
          return res.status(400).json({ message: 'API name already exists' });
        }
      }

      const result = await apiService.update(req.tenant.id, req.params.id, data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 删除API
  async delete(req: Request, res: Response) {
    try {
      await apiService.delete(req.tenant.id, req.params.id);
      res.status(200).json({ message: 'API deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
} 