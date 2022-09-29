/**
 * map an object partially
 * @param oldObj Object to be updated
 * @param newObj Update fields
 */
export function CommonMapValue<T>(oldObj: T, newObj: any): T {
  for (const [key, value] of Object.entries(newObj)) {
    oldObj[key] = value;
  }
  return oldObj;
}

/**
 * Update an object partially
 * @param oldObj Object to be updated
 * @param newObj Update fields
 */
export function CommonMapUpdateValue<T>(oldObj: T, newObj: any): T {
  for (const [key, value] of Object.entries(newObj)) {
    if (key in oldObj) {
      oldObj[key] = value;
    }
  }
  return oldObj;
}
