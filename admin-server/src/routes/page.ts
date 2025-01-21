import { Router } from 'express';
import { PageController } from '../controllers/page';
import { authenticate } from '../middlewares/auth';

const router = Router();
const pageController = new PageController();

// 所有路由都需要认证
router.use(authenticate);

// 页面路由
router.post('/', pageController.create);
router.get('/', pageController.list);
router.get('/:id', pageController.getById);
router.put('/:id', pageController.update);
router.delete('/:id', pageController.delete);

export default router; 