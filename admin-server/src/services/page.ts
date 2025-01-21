import { PrismaClient } from '@prisma/client';
import { PageCreateInput, PageUpdateInput, PageResponseDto, PageStatus } from '../types/page';
import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

export class PageService {
  private readonly buildTemplate = path.resolve(process.cwd(), 'micro-template');
  private readonly pagesRoot = path.resolve(process.cwd(), 'pages');

  constructor() {
    // 确保必要的目录存在
    fs.ensureDirSync(this.pagesRoot);
  }

  // 私有方法：转换页面响应
  private transformPageResponse(page: any): PageResponseDto {
    const buildPath = page.buildPath || path.join(this.pagesRoot, page.tenantId, 'pages', page.pageName, 'build');
    return {
      ...page,
      buildPath: fs.existsSync(buildPath) ? buildPath : null
    };
  }

  // 创建页面
  async create(tenantId: string, data: PageCreateInput): Promise<PageResponseDto> {
    // 检查页面名称是否已存在
    const exists = await this.checkPageNameExists(tenantId, data.pageName);
    if (exists) {
      throw new Error('Page name already exists');
    }

    // 创建页面记录
    const page = await prisma.page.create({
      data: {
        pageName: data.pageName,
        title: data.title,
        content: data.content || null,
        status: data.status || 'draft',
        tenant: {
          connect: { id: tenantId }
        }
      }
    });

    // 如果有页面内容，则构建页面
    if (data.content) {
      await this.buildPage(tenantId, page.id, data.pageName, data.content);
    }

    return this.transformPageResponse(page);
  }

  // 获取页面列表
  async list(tenantId: string): Promise<PageResponseDto[]> {
    const pages = await prisma.page.findMany({
      where: { tenantId }
    });
    return pages.map(page => this.transformPageResponse(page));
  }

  // 获取页面详情
  async getById(tenantId: string, id: string): Promise<PageResponseDto> {
    const page = await prisma.page.findFirst({
      where: {
        id,
        tenantId
      }
    });

    if (!page) {
      throw new Error('Page not found');
    }

    return this.transformPageResponse(page);
  }

  // 更新页面
  async update(tenantId: string, id: string, data: PageUpdateInput): Promise<PageResponseDto> {
    const page = await this.getById(tenantId, id);

    // 如果要更新页面名称，检查是否已存在
    if (data.pageName && data.pageName !== page.pageName) {
      const exists = await this.checkPageNameExists(tenantId, data.pageName);
      if (exists) {
        throw new Error('Page name already exists');
      }
    }

    // 更新页面记录
    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        pageName: data.pageName,
        title: data.title,
        content: data.content,
        status: data.status,
        buildPath: data.content ? path.join(this.pagesRoot, tenantId, 'pages', data.pageName || page.pageName, 'build') : page.buildPath
      }
    });

    // 如果内容有更新，重新构建页面
    if (data.content && data.content.charAt(0) !== '<') {
      await this.buildPage(tenantId, id, updatedPage.pageName, data.content);
    }

    return this.transformPageResponse(updatedPage);
  }

  // 删除页面
  async delete(tenantId: string, id: string): Promise<void> {
    const page = await this.getById(tenantId, id);

    // 删除构建文件
    if (page.buildPath) {
      await fs.remove(page.buildPath);
    }

    // 删除页面记录
    await prisma.page.delete({
      where: { id }
    });
  }

  // 检查页面名称是否已存在
  private async checkPageNameExists(tenantId: string, pageName: string, excludeId?: string): Promise<boolean> {
    const page = await prisma.page.findFirst({
      where: {
        tenantId,
        pageName,
        id: excludeId ? { not: excludeId } : undefined
      }
    });

    return !!page;
  }

  // 构建页面
  private async buildPage(tenantId: string, pageId: string, pageName: string, content: string): Promise<void> {
    // 创建临时构建目录
    const buildDir = path.join(this.pagesRoot, tenantId, 'pages', pageName, 'build');
    await fs.ensureDir(buildDir);

    try {
      // 将页面内容写入模板
      const templateDir = path.join(this.buildTemplate, 'src', 'pages');
      await fs.ensureDir(templateDir);
      await fs.writeFile(
        path.join(templateDir, 'index.json'),
        content
      );

      // 执行构建
      await execAsync('npm run build', {
        cwd: this.buildTemplate
      });

      // 复制构建文件到目标目录
      await fs.copy(
        path.join(this.buildTemplate, 'build'),
        buildDir
      );

      // 更新页面记录的构建路径
      await prisma.page.update({
        where: { id: pageId },
        data: { buildPath: buildDir }
      });
    } catch (error) {
      // 清理临时文件
      await fs.remove(buildDir);
      throw error;
    }
  }
} 