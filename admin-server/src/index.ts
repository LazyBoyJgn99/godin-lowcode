import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import tenantRoutes from './routes/tenant';
import apiRoutes from './routes/api';
import pageRoutes from './routes/page';
import menuRoutes from './routes/menu';

// 加载环境变量
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(json());

// 路由
app.use('/api/tenant', tenantRoutes);
app.use('/api/apis', apiRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/menus', menuRoutes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 