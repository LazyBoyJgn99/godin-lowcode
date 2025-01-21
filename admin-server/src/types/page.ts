import { Page } from '@prisma/client';

export type PageStatus = 'draft' | 'published';

export type PageCreateInput = {
  pageName: string;    // 页面名称（租户下唯一）
  title: string;       // 页面标题
  content?: string;    // 页面内容（JSON格式的页面配置）
  status?: PageStatus; // 页面状态
};

export type PageUpdateInput = Partial<PageCreateInput>;

export type PageResponseDto = {
  id: string;
  pageName: string;
  title: string;
  content: string | null;
  status: PageStatus;
  buildPath: string | null;  // 构建文件路径
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}; 