export interface Tenant {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  pageName: string;
  parentId?: string;
  children?: MenuItem[];
  order: number;
  tenantId: string;
}

export interface Page {
  id: string;
  name: string;
  pageName: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Api {
  id: string;
  name: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  targetUrl: string;
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
} 