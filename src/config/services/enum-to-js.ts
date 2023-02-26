export function enumToObject<T extends Record<string, string | number>>(
  enumeration: T,
): Record<keyof T, T[keyof T]> {
  const obj: Record<keyof T, T[keyof T]> = {} as Record<keyof T, T[keyof T]>;
  for (const key in enumeration) {
    if (
      typeof enumeration[key] === 'string' ||
      typeof enumeration[key] === 'number'
    ) {
      obj[key] = enumeration[key] as T[keyof T];
    }
  }
  return obj;
}
