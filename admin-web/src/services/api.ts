import http from './http';

export interface ApiParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default?: any;
}

export interface ApiConfig {
  parameters?: {
    query?: ApiParameter[];
    body?: ApiParameter[];
    path?: ApiParameter[];
  };
  headers?: Record<string, string>;
}

export interface Api {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  targetUrl: string;
  config: ApiConfig;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiDto {
  name: string;
  method: Api['method'];
  path: string;
  targetUrl: string;
  parameters?: ApiConfig['parameters'];
  headers?: ApiConfig['headers'];
}

export interface UpdateApiDto extends Partial<CreateApiDto> {}

// 获取API列表
export const getApis = () => {
  return http.get<{ apis: Api[] }>('/apis');
};

// 创建API
export const createApi = (data: CreateApiDto) => {
  return http.post<Api>('/apis', data);
};

// 获取API详情
export const getApiById = (id: string) => {
  return http.get<Api>(`/apis/${id}`);
};

// 更新API
export const updateApi = (id: string, data: UpdateApiDto) => {
  return http.put<Api>(`/apis/${id}`, data);
};

// 删除API
export const deleteApi = (id: string) => {
  return http.delete<{ message: string }>(`/apis/${id}`);
}; 