import { Request, Response } from 'express';
import { TenantService } from '../services/tenant';
import { TenantCreateInput, TenantLoginInput } from '../types/tenant';

const tenantService = new TenantService();

export class TenantController {
  // 注册新租户
  async register(req: Request, res: Response) {
    try {
      const data = req.body as TenantCreateInput;
      const result = await tenantService.create(data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 租户登录
  async login(req: Request, res: Response) {
    try {
      const data = req.body as TenantLoginInput;
      const result = await tenantService.login(data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  // 获取当前租户信息
  async getCurrentTenant(req: Request, res: Response) {
    try {
      res.status(200).json(req.tenant);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // 更新租户信息
  async updateTenant(req: Request, res: Response) {
    try {
      const result = await tenantService.update(req.tenant.id, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
} 