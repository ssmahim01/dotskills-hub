/* eslint-disable @typescript-eslint/no-unused-vars */

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export function getStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    if (typeof window === 'undefined') return defaultValue ?? null;
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue ?? null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`[v0] Error reading from localStorage key "${key}":`, error);
    return defaultValue ?? null;
  }
}

export function setStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined') return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[v0] Error writing to localStorage key "${key}":`, error);
    return false;
  }
}

export function removeStorage(key: string): boolean {
  try {
    if (typeof window === 'undefined') return false;
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[v0] Error removing from localStorage key "${key}":`, error);
    return false;
  }
}

export function clearStorage(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('[v0] Error clearing localStorage:', error);
    return false;
  }
}

export function hasStorage(key: string): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(key) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Generic service base class for CRUD operations with localStorage
 */
export abstract class LocalStorageService<T extends { id: string }> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.initialize();
  }

  protected initialize(): void {
    if (!hasStorage(this.storageKey)) {
      setStorage(this.storageKey, []);
    }
  }

  protected getAll(): T[] {
    return getStorage<T[]>(this.storageKey, []) ?? [];
  }

  protected saveAll(items: T[]): void {
    setStorage(this.storageKey, items);
  }

  create(item: Omit<T, 'id'> & { id?: string }): T {
    const items = this.getAll();
    const newItem: T = {
      ...item,
      id: item.id || this.generateId(),
    } as T;
    items.push(newItem);
    this.saveAll(items);
    return newItem;
  }

  read(id: string): T | undefined {
    const items = this.getAll();
    return items.find((item) => item.id === id);
  }

  update(id: string, updates: Partial<Omit<T, 'id'>>): T | undefined {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    items[index] = { ...items[index], ...updates };
    this.saveAll(items);
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false; // Item not found

    this.saveAll(filtered);
    return true;
  }

  getAll_(): T[] {
    return this.getAll();
  }

  clear(): void {
    setStorage(this.storageKey, []);
  }

  protected generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
