import { MenuEntity } from '@/modules/menu/entities/menu.entity';

export function buildMenuTree(menuList: MenuEntity[], parentId = null) {
  function buildTree(parentId = null) {
    return menuList
      .filter((item) => item.parentId === parentId)
      .map((item) => {
        const children = buildTree(item.id);
        return children.length ? { ...item, children } : { ...item };
      });
  }

  return buildTree(parentId);
}
