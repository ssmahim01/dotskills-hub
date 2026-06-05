import {
  Store,
  CreateStorePayload,
  UpdateStorePayload,
  StoreStatus,
} from "../../types/store.types";
import { getStorage, setStorage } from "./localStorage";
import { STORAGE_KEYS } from "../utils/constants";
import { seedStores } from "./seed-data";

class StoreService {
  private readonly storageKey = STORAGE_KEYS.STORES;

  /**
   * Initialize store service with seed data if needed
   */
  initialize(): void {
    if (!getStorage(this.storageKey)) {
      setStorage(this.storageKey, seedStores);
    }
  }

  /**
   * Get all stores
   */
  getAll(): Store[] {
    return getStorage<Store[]>(this.storageKey, []) || [];
  }

  /**
   * Get store by ID
   */
  getById(id: string): Store | undefined {
    const stores = this.getAll();
    return stores.find((s) => s.id === id);
  }

  /**
   * Get stores by status
   */
  getByStatus(status: StoreStatus): Store[] {
    const stores = this.getAll();
    return stores.filter((s) => s.status === status);
  }

  /**
   * Get active stores
   */
  getActive(): Store[] {
    return this.getByStatus("active");
  }

  /**
   * Get store by subdomain
   */
  getBySubdomain(subdomain: string): Store | undefined {
    const stores = this.getAll();
    return stores.find((s) => s.subdomain === subdomain);
  }

  /**
   * Check if subdomain is available
   */
  isSubdomainAvailable(subdomain: string): boolean {
    return !this.getBySubdomain(subdomain);
  }

  /**
   * Create new store
   */
  create(payload: CreateStorePayload): {
    success: boolean;
    store?: Store;
    error?: string;
  } {
    // Check subdomain availability
    if (!this.isSubdomainAvailable(payload.subdomain)) {
      return { success: false, error: "Subdomain already taken" };
    }

    const stores = this.getAll();
    const newStore: Store = {
      id: `store_${Date.now()}`,
      storeName: payload.storeName,
      subdomain: payload.subdomain,
      ownerName: payload.ownerName,
      ownerEmail: payload.ownerEmail,
      phone: payload.phone,
      package: payload.package,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
    };

    stores.push(newStore);
    setStorage(this.storageKey, stores);
    return { success: true, store: newStore };
  }

  /**
   * Update store
   */
  update(
    id: string,
    payload: UpdateStorePayload,
  ): { success: boolean; store?: Store; error?: string } {
    const stores = this.getAll();
    const index = stores.findIndex((s) => s.id === id);

    if (index === -1) {
      return { success: false, error: "Store not found" };
    }

    const updatedStore = {
      ...stores[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    stores[index] = updatedStore;
    setStorage(this.storageKey, stores);
    return { success: true, store: updatedStore };
  }

  /**
   * Delete store
   */
  delete(id: string): boolean {
    const stores = this.getAll();
    const filtered = stores.filter((s) => s.id !== id);

    if (filtered.length === stores.length) return false;

    setStorage(this.storageKey, filtered);
    return true;
  }

  /**
   * Activate store
   */
  activate(id: string): Store | undefined {
    return this.update(id, { status: "active" }).store;
  }

  /**
   * Suspend store
   */
  suspend(id: string): Store | undefined {
    return this.update(id, { status: "suspended" }).store;
  }

  /**
   * Get store count
   */
  getTotalCount(): number {
    return this.getAll().length;
  }

  /**
   * Get active store count
   */
  getActiveCount(): number {
    return this.getActive().length;
  }

  /**
   * Get total revenue from all stores
   */
  getTotalRevenue(): number {
    const stores = this.getAll();
    return stores.reduce(
      (total, store) => total + (store.totalRevenue || 0),
      0,
    );
  }

  /**
   * Get total products across all stores
   */
  getTotalProducts(): number {
    const stores = this.getAll();
    return stores.reduce(
      (total, store) => total + (store.totalProducts || 0),
      0,
    );
  }

  /**
   * Get total orders across all stores
   */
  getTotalOrders(): number {
    const stores = this.getAll();
    return stores.reduce((total, store) => total + (store.totalOrders || 0), 0);
  }

  /**
   * Search stores
   */
  search(query: string): Store[] {
    const stores = this.getAll();
    const lowerQuery = query.toLowerCase();
    return stores.filter(
      (s) =>
        s.storeName.toLowerCase().includes(lowerQuery) ||
        s.subdomain.toLowerCase().includes(lowerQuery) ||
        s.ownerName.toLowerCase().includes(lowerQuery) ||
        s.ownerEmail.toLowerCase().includes(lowerQuery),
    );
  }

  /**
   * Get stores by package
   */
  getByPackage(pkg: string): Store[] {
    const stores = this.getAll();
    return stores.filter((s) => s.package === pkg);
  }

  /**
   * Get recent stores
   */
  getRecent(limit = 5): Store[] {
    const stores = this.getAll();
    return stores
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  }

  /**
   * Update store statistics
   */
  updateStats(
    id: string,
    stats: {
      totalProducts?: number;
      totalOrders?: number;
      totalRevenue?: number;
      lastActivityAt?: string;
    },
  ): Store | undefined {
    return this.update(id, stats)?.store;
  }
}

export const storeService = new StoreService();
