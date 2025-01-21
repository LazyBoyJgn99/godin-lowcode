import { Router } from 'express';
import { ApiController } from '../controllers/api';
import { authenticate } from '../middlewares/auth';

const router = Router();
const apiController = new ApiController();

// 所有路由都需要认证
router.use(authenticate);

// API 路由
router.post('/', apiController.create);
router.get('/', apiController.list);
router.get('/:id', apiController.getById);
router.put('/:id', apiController.update);
router.delete('/:id', apiController.delete);

export default router; 