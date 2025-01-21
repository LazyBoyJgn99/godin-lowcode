import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { TenantService } from '../services/tenant';

declare global {
  namespace Express {
    interface Request {
      tenant?: any;
    }
  }
}

const tenantService = new TenantService();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = verifyToken(token);
    const tenant = await tenantService.getById(decoded.id);
    
    req.tenant = tenant;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}; 