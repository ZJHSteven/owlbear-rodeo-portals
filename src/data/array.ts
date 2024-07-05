export function requireOne<T>(array: T[]): T {
  if (array.length === 0) {
    throw "not found";
  }

  if (array.length > 1) {
    console.warn(`expected 1, got ${array.length}}`);
  }

  return array[0];
}

export function optionalOne<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }

  if (array.length > 1) {
    console.warn(`expected 1, got ${array.length}}`);
  }

  return array[0];
}
