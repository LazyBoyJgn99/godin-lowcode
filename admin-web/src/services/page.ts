import http from './http';

export interface Page {
  id: string;
  pageName: string;
  title: string;
  content?: string;
  status: 'draft' | 'published';
  buildPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageDto {
  pageName: string;
  title: string;
  status?: 'draft' | 'published';
}

export interface UpdatePageDto extends Partial<CreatePageDto> {}

export interface PageData {
  id: string;
  pageName: string;
  content: string;
  description: string;
  buildPath: string;
  status: 'draft' | 'published';
  tenantId: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

// 获取页面列表
export const getPages = () => {
  return http.get<{ pages: Page[] }>('/pages');
};

// 创建页面
export const createPage = (data: CreatePageDto) => {
  return http.post<Page>('/pages', data);
};

// 获取页面详情
export const getPageById = (id: string) => {
  return http.get<Page>(`/pages/${id}`);
};

// 更新页面
export const updatePage = (id: string, data: UpdatePageDto) => {
  return http.put<Page>(`/pages/${id}`, data);
};

// 删除页面
export const deletePage = (id: string) => {
  return http.delete<{ message: string }>(`/pages/${id}`);
};

// 获取页面详情
export const getPageDetail = (id: string) => {
  return http.get<PageData>(`/pages/${id}`);
};

// 保存页面
export const savePage = (id: string, data: PageData) => {
  return http.put<PageData>(`/pages/${id}`, data);
}; 