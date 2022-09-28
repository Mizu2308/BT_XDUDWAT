export function hasDuplicates(arr: string[]) {
  if (arr.length === 0) return false;
  return arr.some((x) => arr.indexOf(x) !== arr.lastIndexOf(x));
}

export function getDuplicates<T>(arr: T[]): T[] {
  return arr.filter((e, i, a) => a.indexOf(e) !== i);
}

export function removeDuplicated<T>(arr: T[]): T[] {
  return arr.filter((e, i, a) => a.indexOf(e) === i);
}
