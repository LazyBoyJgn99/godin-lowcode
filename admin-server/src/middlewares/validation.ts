import { Request, Response, NextFunction } from 'express';

// 验证租户注册信息
export const validateTenant = (req: Request, res: Response, next: NextFunction) => {
  const { tenantId, password, name } = req.body;

  // 验证租户ID
  if (!tenantId || typeof tenantId !== 'string' || tenantId.length < 3) {
    return res.status(400).json({ message: '租户ID至少需要3个字符' });
  }

  // 验证租户ID格式：必须英文开头，不能包含中文
  const tenantIdRegex = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
  if (!tenantIdRegex.test(tenantId)) {
    return res.status(400).json({ message: '租户ID必须以英文字母开头，只能包含英文、数字、下划线和连字符' });
  }

  // 验证密码
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: '密码至少需要6个字符' });
  }

  // 验证名称
  if (!name || typeof name !== 'string' || name.length < 2) {
    return res.status(400).json({ message: '名称至少需要2个字符' });
  }

  next();
}; 