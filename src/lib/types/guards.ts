/**
 * Type Guards
 * Runtime type checking utilities for better type safety
 */

/**
 * Type guard to check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Type guard to check if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

/**
 * Type guard to check if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * Type guard to check if value is an object (not null, not array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Type guard to check if value is an array
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

/**
 * Type guard to check if value is a valid URL string
 */
export function isValidUrl(value: unknown): value is string {
  if (!isString(value)) {
    return false;
  }
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Type guard to check if value has a specific property
 */
export function hasProperty<K extends string>(
  value: unknown,
  key: K,
): value is Record<K, unknown> {
  return isObject(value) && key in value;
}

/**
 * Type guard to check if value has all specified properties
 */
export function hasProperties<K extends string>(
  value: unknown,
  keys: K[],
): value is Record<K, unknown> {
  if (!isObject(value)) {
    return false;
  }
  return keys.every((key) => key in value);
}

/**
 * Safely gets a property value with type checking
 */
export function getProperty<T>(
  obj: unknown,
  key: string,
  typeGuard?: (value: unknown) => value is T,
): T | undefined {
  if (!isObject(obj) || !(key in obj)) {
    return undefined;
  }
  const value = obj[key];
  if (typeGuard && !typeGuard(value)) {
    return undefined;
  }
  return value as T;
}

/**
 * Safely gets a nested property value
 */
export function getNestedProperty<T>(
  obj: unknown,
  path: string[],
  typeGuard?: (value: unknown) => value is T,
): T | undefined {
  if (!isObject(obj) || path.length === 0) {
    return undefined;
  }

  let current: unknown = obj;
  for (const key of path) {
    if (!isObject(current) || !(key in current)) {
      return undefined;
    }
    current = current[key];
  }

  if (typeGuard && !typeGuard(current)) {
    return undefined;
  }

  return current as T;
}

/**
 * Type guard to check if value is a record with string keys
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return isObject(value);
}

/**
 * Type guard to check if value is a record with specific value type
 */
export function isRecordOf<T>(
  value: unknown,
  valueGuard: (val: unknown) => val is T,
): value is Record<string, T> {
  if (!isRecord(value)) {
    return false;
  }
  return Object.values(value).every(valueGuard);
}
