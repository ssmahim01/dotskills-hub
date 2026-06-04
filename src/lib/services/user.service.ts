import { UserManagement, CreateUserPayload, UpdateUserPayload } from '../types/user.types';
import { getStorage, setStorage } from './localStorage';
import { seedUserManagement } from './seed-data';

class UserService {
  private readonly storageKey = 'dotskills_users_management';

  /**
   * Initialize user service with seed data if needed
   */
  initialize(): void {
    if (!getStorage(this.storageKey)) {
      setStorage(this.storageKey, seedUserManagement);
    }
  }

  /**
   * Get all users
   */
  getAll(): UserManagement[] {
    return getStorage<UserManagement[]>(this.storageKey, []) || [];
  }

  /**
   * Get user by ID
   */
  getById(id: string): UserManagement | undefined {
    const users = this.getAll();
    return users.find((u) => u.id === id);
  }

  /**
   * Get user by email
   */
  getByEmail(email: string): UserManagement | undefined {
    const users = this.getAll();
    return users.find((u) => u.email === email);
  }

  /**
   * Get users by role
   */
  getByRole(role: string): UserManagement[] {
    const users = this.getAll();
    return users.filter((u) => u.role === role);
  }

  /**
   * Get users by status
   */
  getByStatus(status: string): UserManagement[] {
    const users = this.getAll();
    return users.filter((u) => u.status === status);
  }

  /**
   * Get active users
   */
  getActive(): UserManagement[] {
    return this.getByStatus('active');
  }

  /**
   * Get users by store
   */
  getByStore(storeId: string): UserManagement[] {
    const users = this.getAll();
    return users.filter((u) => u.storeId === storeId);
  }

  /**
   * Create new user
   */
  create(payload: CreateUserPayload): { success: boolean; user?: UserManagement; error?: string } {
    const users = this.getAll();

    // Check if email already exists
    if (users.some((u) => u.email === payload.email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser: UserManagement = {
      id: `user_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: 'active',
      createdAt: new Date().toISOString(),
      storeId: payload.storeId,
    };

    users.push(newUser);
    setStorage(this.storageKey, users);
    return { success: true, user: newUser };
  }

  /**
   * Update user
   */
  update(id: string, payload: UpdateUserPayload): { success: boolean; user?: UserManagement; error?: string } {
    const users = this.getAll();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return { success: false, error: 'User not found' };
    }

    // Check if new email already exists (but not same user)
    if (
      payload.email &&
      payload.email !== users[index].email &&
      users.some((u) => u.email === payload.email)
    ) {
      return { success: false, error: 'Email already exists' };
    }

    const updatedUser = { ...users[index], ...payload };
    users[index] = updatedUser;
    setStorage(this.storageKey, users);
    return { success: true, user: updatedUser };
  }

  /**
   * Delete user
   */
  delete(id: string): boolean {
    const users = this.getAll();
    const filtered = users.filter((u) => u.id !== id);

    if (filtered.length === users.length) return false;

    setStorage(this.storageKey, filtered);
    return true;
  }

  /**
   * Get total user count
   */
  getTotalCount(): number {
    return this.getAll().length;
  }

  /**
   * Get active user count
   */
  getActiveCount(): number {
    return this.getActive().length;
  }

  /**
   * Search users
   */
  search(query: string): UserManagement[] {
    const users = this.getAll();
    const lowerQuery = query.toLowerCase();
    return users.filter((u) =>
      u.name.toLowerCase().includes(lowerQuery) ||
      u.email.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Update last login
   */
  updateLastLogin(id: string): UserManagement | undefined {
    const result = this.update(
      id,
      { lastLoginAt: new Date().toISOString() } as unknown as UpdateUserPayload
    );
    return result.user;
  }

  /**
   * Change user status
   */
  changeStatus(id: string, status: 'active' | 'inactive' | 'suspended'): UserManagement | undefined {
    const result = this.update(id, { status });
    return result.user;
  }

  /**
   * Get super admins
   */
  getSuperAdmins(): UserManagement[] {
    return this.getByRole('super-admin');
  }

  /**
   * Get store owners
   */
  getStoreOwners(): UserManagement[] {
    return this.getByRole('store-owner');
  }
}

export const userService = new UserService();
