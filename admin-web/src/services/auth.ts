import http from './http';

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface TenantResponse {
  tenant: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

export const register = async (params: RegisterParams): Promise<TenantResponse> => {
  const res = await http.post<TenantResponse>('/tenant/register', params);
  console.log("res", res);
  const data = res.data;
  console.log("data", data);
  // 保存 token 到 localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const login = async (params: LoginParams): Promise<TenantResponse> => {
  const { data } = await http.post<TenantResponse>('/tenant/login', params);
  // 保存 token 到 localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const logout = async () => {
  // 清除 token
  localStorage.removeItem('token');
};

export const getCurrentTenant = async () => {
  const { data } = await http.get<TenantResponse['tenant']>('/tenant/me');
  return data;
};

export const updateTenant = async (params: Partial<RegisterParams>) => {
  const { data } = await http.put<TenantResponse['tenant']>('/tenant/me', params);
  return data;
}; 