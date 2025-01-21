import { Api } from '@prisma/client';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ApiParameter = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  default?: any;
};

export type ApiResponseSchema = {
  status: number;
  description?: string;
  schema: Record<string, any>;
};

export type ApiConfig = {
  parameters?: {
    query?: ApiParameter[];
    body?: ApiParameter[];
    path?: ApiParameter[];
  };
  responses?: Record<string, ApiResponseSchema>;
  headers?: Record<string, string>;
};

export type ApiCreateInput = {
  name: string;
  method: ApiMethod;
  path: string;
  targetUrl: string;
  parameters?: Record<string, any>;
  headers?: Record<string, any>;
  config?: ApiConfig;
};

export type ApiUpdateInput = Partial<ApiCreateInput>;

export type ApiResponseDto = Omit<Api, 'parameters' | 'headers'> & {
  config: ApiConfig;
}; 