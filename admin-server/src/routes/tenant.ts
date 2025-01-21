import { Router } from 'express';
import { TenantController } from '../controllers/tenant';
import { authenticate } from '../middlewares/auth';

const router = Router();
const tenantController = new TenantController();

// 公开路由
router.post('/register', tenantController.register);
router.post('/login', tenantController.login);

// 需要认证的路由
router.get('/me', authenticate, tenantController.getCurrentTenant);
router.put('/me', authenticate, tenantController.updateTenant);

export default router; 