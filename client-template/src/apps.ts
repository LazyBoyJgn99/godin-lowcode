import { AppConfig } from '@ice/stark';
import { getMenuTree } from './services/menu';

export const getApps = async (): Promise<AppConfig[]> => {
  const tenantId = window.location.pathname.split('/')[2];
  
  try {
    // 获取菜单树
    const { menus } = await getMenuTree(tenantId);
    
    // 将菜单转换为应用配置
    const apps: AppConfig[] = menus
      .filter(menu => menu.pageName) // 只处理有页面的菜单项
      .map(menu => ({
        path: `/${tenantId}/pages/${menu.pageName}`,
        title: menu.name,
        url: [
          `/page/${tenantId}/pages/${menu.pageName}/index.js`,
          `/page/${tenantId}/pages/${menu.pageName}/index.css`,
        ],
        sandbox: true
      }));

    return apps;
  } catch (error) {
    console.error('Failed to load apps:', error);
    return [];
  }
}; 