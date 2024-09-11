type TupleToObject<T extends string, P extends ReadonlyArray<string>> = {
  [K in Uppercase<P[number]>]: `${T}:${Lowercase<K>}`;
};
type AddPrefixToObjectValue<
  T extends string,
  P extends Record<string, string>,
> = {
  [K in keyof P]: K extends string ? `${T}:${P[K]}` : never;
};

let permissions: string[] = [];

export function definePermission<
  T extends string,
  U extends Record<string, string>,
>(modulePrefix: T, actionMap: U): AddPrefixToObjectValue<T, U>;
export function definePermission<
  T extends string,
  U extends ReadonlyArray<string>,
>(modulePrefix: T, actions: U): TupleToObject<T, U>;
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
