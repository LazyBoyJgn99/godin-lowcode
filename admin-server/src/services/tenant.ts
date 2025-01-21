import { PrismaClient } from '@prisma/client';
import { TenantCreateInput, TenantLoginInput, TenantResponse, AuthResponse } from '../types/tenant';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

const prisma = new PrismaClient();

export class TenantService {
  // 创建租户
  async create(data: TenantCreateInput): Promise<AuthResponse> {
    const hashedPassword = await hashPassword(data.password);
    
    const tenant = await prisma.tenant.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const { password: _, ...tenantWithoutPassword } = tenant;
    const token = generateToken(tenantWithoutPassword);

    return {
      tenant: tenantWithoutPassword,
      token,
    };
  }

  // 租户登录
  async login(data: TenantLoginInput): Promise<AuthResponse> {
    const tenant = await prisma.tenant.findUnique({
      where: { email: data.email },
    });

    if (!tenant) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(data.password, tenant.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...tenantWithoutPassword } = tenant;
    const token = generateToken(tenantWithoutPassword);

    return {
      tenant: tenantWithoutPassword,
      token,
    };
  }

  // 获取租户信息
  async getById(id: string): Promise<TenantResponse> {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const { password: _, ...tenantWithoutPassword } = tenant;
    return tenantWithoutPassword;
  }

  // 更新租户信息
  async update(id: string, data: Partial<TenantCreateInput>): Promise<TenantResponse> {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const tenant = await prisma.tenant.update({
      where: { id },
      data,
    });

    const { password: _, ...tenantWithoutPassword } = tenant;
    return tenantWithoutPassword;
  }
} 