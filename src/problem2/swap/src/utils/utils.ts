export const uniqueByProperty = <T extends Record<string, unknown>, K extends keyof T>(
  arr: T[],
  prop: K
): T[] => {
  return Object.values(
    arr.reduce((acc, item) => {
      const key = item[prop] as string | number | symbol;
      acc[key] = item;
      return acc;
    }, {} as Record<string | number | symbol, T>)
  );
};

export const getTokenLogoUrl = (currency: string): string => {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/${currency}.svg`;
}