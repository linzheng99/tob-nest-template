let permissions: string[] = [];
export function definePermission(
  modulePrefix: string,
  actions: { [s: string]: string },
) {
  const array = Object.entries(actions);
  array.forEach(([key, action]) => {
    actions[key] = `${modulePrefix}:${action}`;
  });
  permissions = [
    ...new Set([...permissions, ...Object.values<string>(actions)]),
  ];
  return actions;
}

/** 获取所有通过 definePermission 定义的权限 */
export const getDefinePermissions = () => permissions;
