import { Subscription, SubscriptionStatus } from '../types/subscription.types';
import { getStorage, setStorage } from './localStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { seedSubscriptions } from './seed-data';

class SubscriptionService {
  private readonly storageKey = STORAGE_KEYS.SUBSCRIPTIONS;

  /**
   * Initialize subscription service with seed data if needed
   */
  initialize(): void {
    if (!getStorage(this.storageKey)) {
      setStorage(this.storageKey, seedSubscriptions);
    }
  }

  /**
   * Get all subscriptions
   */
  getAll(): Subscription[] {
    return getStorage<Subscription[]>(this.storageKey, []) || [];
  }

  /**
   * Get subscription by ID
   */
  getById(id: string): Subscription | undefined {
    const subs = this.getAll();
    return subs.find((s) => s.id === id);
  }

  /**
   * Get subscriptions by status
   */
  getByStatus(status: SubscriptionStatus): Subscription[] {
    const subs = this.getAll();
    return subs.filter((s) => s.status === status);
  }

  /**
   * Get pending subscriptions
   */
  getPending(): Subscription[] {
    return this.getByStatus('pending');
  }

  /**
   * Get approved subscriptions
   */
  getApproved(): Subscription[] {
    return this.getByStatus('approved');
  }

  /**
   * Create new subscription
   */
  create(data: Omit<Subscription, 'id' | 'createdAt'>): Subscription {
    const subs = this.getAll();
    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    subs.push(newSub);
    setStorage(this.storageKey, subs);
    return newSub;
  }

  /**
   * Update subscription
   */
  update(id: string, updates: Partial<Omit<Subscription, 'id' | 'createdAt'>>): Subscription | undefined {
    const subs = this.getAll();
    const index = subs.findIndex((s) => s.id === id);

    if (index === -1) return undefined;

    subs[index] = { ...subs[index], ...updates };
    setStorage(this.storageKey, subs);
    return subs[index];
  }

  /**
   * Approve subscription
   */
  approve(id: string, approvedBy: string): Subscription | undefined {
    return this.update(id, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy,
    });
  }

  /**
   * Reject subscription
   */
  reject(id: string, reason: string): Subscription | undefined {
    return this.update(id, {
      status: 'rejected',
      rejectionReason: reason,
    });
  }

  /**
   * Delete subscription
   */
  delete(id: string): boolean {
    const subs = this.getAll();
    const filtered = subs.filter((s) => s.id !== id);

    if (filtered.length === subs.length) return false;

    setStorage(this.storageKey, filtered);
    return true;
  }

  /**
   * Get total count
   */
  getTotalCount(): number {
    return this.getAll().length;
  }

  /**
   * Get count by status
   */
  getCountByStatus(status: SubscriptionStatus): number {
    return this.getByStatus(status).length;
  }

  /**
   * Search subscriptions
   */
  search(query: string): Subscription[] {
    const subs = this.getAll();
    const lowerQuery = query.toLowerCase();
    return subs.filter((s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.email.toLowerCase().includes(lowerQuery) ||
      s.transactionId.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get total revenue from approved subscriptions
   */
  getTotalRevenue(): number {
    const approved = this.getApproved();
    return approved.reduce((total, sub) => total + sub.amount, 0);
  }

  /**
   * Get monthly revenue
   */
  getMonthlyRevenue(): number {
    const approved = this.getApproved();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return approved
      .filter((sub) => {
        const date = new Date(sub.approvedAt || sub.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((total, sub) => total + sub.amount, 0);
  }

  /**
   * Get recent subscriptions
   */
  getRecent(limit = 5): Subscription[] {
    const subs = this.getAll();
    return subs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const subscriptionService = new SubscriptionService();
