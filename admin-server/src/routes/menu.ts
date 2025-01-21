import { Router } from 'express';
import { MenuController } from '../controllers/menu';
import { authenticate } from '../middlewares/auth';

const router = Router();
const menuController = new MenuController();

// 所有路由都需要认证
router.use(authenticate);

// 菜单路由
router.post('/', menuController.create);
router.get('/', menuController.getTree);
router.put('/:id', menuController.update);
router.delete('/:id', menuController.delete);
router.put('/batch-sort', menuController.batchUpdateSort);

export default router; 