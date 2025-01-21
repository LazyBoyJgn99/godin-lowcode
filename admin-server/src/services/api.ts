import { PrismaClient, Prisma } from '@prisma/client';
import { ApiCreateInput, ApiUpdateInput, ApiResponseDto } from '../types/api';

const prisma = new PrismaClient();

export class ApiService {
  // 创建API
  async create(tenantId: string, data: ApiCreateInput): Promise<ApiResponseDto> {
    const api = await prisma.api.create({
      data: {
        name: data.name,
        method: data.method,
        path: data.path,
        targetUrl: data.targetUrl,
        parameters: data.parameters as Prisma.InputJsonValue,
        headers: data.headers as Prisma.InputJsonValue,
        tenant: {
          connect: { id: tenantId }
        },
      },
    });

    return this.transformApiResponse(api);
  }

  // 获取API列表
  async list(tenantId: string): Promise<ApiResponseDto[]> {
    const apis = await prisma.api.findMany({
      where: {
        tenantId,
      },
    });

    return apis.map(api => this.transformApiResponse(api));
  }

  // 获取API详情
  async getById(tenantId: string, id: string): Promise<ApiResponseDto> {
    const api = await prisma.api.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!api) {
      throw new Error('API not found');
    }

    return this.transformApiResponse(api);
  }

  // 更新API
  async update(tenantId: string, id: string, data: ApiUpdateInput): Promise<ApiResponseDto> {
    const api = await prisma.api.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!api) {
      throw new Error('API not found');
    }

    const updateData: Prisma.ApiUpdateInput = {
      name: data.name,
      method: data.method,
      path: data.path,
      targetUrl: data.targetUrl,
      parameters: data.parameters as Prisma.InputJsonValue,
      headers: data.headers as Prisma.InputJsonValue,
    };

    const updatedApi = await prisma.api.update({
      where: { id },
      data: updateData,
    });

    return this.transformApiResponse(updatedApi);
  }

  // 删除API
  async delete(tenantId: string, id: string): Promise<void> {
    const api = await prisma.api.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!api) {
      throw new Error('API not found');
    }

    await prisma.api.delete({
      where: { id },
    });
  }

  // 检查API名称是否已存在
  async checkNameExists(tenantId: string, name: string, excludeId?: string): Promise<boolean> {
    const api = await prisma.api.findFirst({
      where: {
        tenantId,
        name,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });

    return !!api;
  }

  // 转换API响应
  private transformApiResponse(api: any): ApiResponseDto {
    return {
      id: api.id,
      name: api.name,
      method: api.method,
      path: api.path,
      targetUrl: api.targetUrl,
      tenantId: api.tenantId,
      createdAt: api.createdAt,
      updatedAt: api.updatedAt,
      config: {
        parameters: api.parameters,
        headers: api.headers,
      },
    };
  }
} 