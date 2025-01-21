import { Tenant } from '@prisma/client';

export type TenantCreateInput = {
  name: string;
  email: string;
  password: string;
};

export type TenantLoginInput = {
  email: string;
  password: string;
};

export type TenantResponse = Omit<Tenant, 'password'>;

export type AuthResponse = {
  tenant: TenantResponse;
  token: string;
}; 