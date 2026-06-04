import { User, AuthSession, LoginPayload, RegisterPayload } from '../types/auth.types';
import { getStorage, setStorage, removeStorage } from './localStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { seedUsers } from './seed-data';

class AuthService {
  private readonly sessionKey = STORAGE_KEYS.AUTH_SESSION;
  private readonly usersKey = STORAGE_KEYS.USERS;

  /**
   * Initialize auth service with seed data if needed
   */
  initialize(): void {
    if (!getStorage(this.usersKey)) {
      setStorage(this.usersKey, seedUsers);
    }
  }

  /**
   * Get current authenticated session
   */
  getCurrentSession(): AuthSession | null {
    return getStorage<AuthSession>(this.sessionKey);
  }

  /**
   * Login user
   */
  login(payload: LoginPayload): { success: boolean; session?: AuthSession; error?: string } {
    const users = getStorage<User[]>(this.usersKey, []) || [];
    const user = users.find((u) => u.email === payload.email);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // In a real app, we'd compare hashed passwords
    if (user.password !== payload.password) {
      return { success: false, error: 'Invalid password' };
    }

    if (user.status !== 'active') {
      return { success: false, error: 'User account is not active' };
    }

    const session: AuthSession = {
      userId: user.id,
      user: { ...user },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    setStorage(this.sessionKey, session);
    return { success: true, session };
  }

  /**
   * Register new user
   */
  register(payload: RegisterPayload): { success: boolean; user?: User; error?: string } {
    const users = getStorage<User[]>(this.usersKey, []) || [];

    // Check if email already exists
    if (users.some((u) => u.email === payload.email)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password, // In real app, this would be hashed
      role: payload.role,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setStorage(this.usersKey, users);

    // Auto-login after registration
    this.login({
      email: payload.email,
      password: payload.password,
    });

    return { success: true, user: newUser };
  }

  /**
   * Logout current user
   */
  logout(): boolean {
    return removeStorage(this.sessionKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    // Check if session has expired
    return new Date(session.expiresAt) > new Date();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    const session = this.getCurrentSession();
    if (!session) return null;
    return session.user;
  }

  /**
   * Update current user
   */
  updateCurrentUser(updates: Partial<User>): { success: boolean; user?: User; error?: string } {
    const session = this.getCurrentSession();
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const users = getStorage<User[]>(this.usersKey, []) || [];
    const userIndex = users.findIndex((u) => u.id === session.userId);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    setStorage(this.usersKey, users);

    // Update session
    const updatedSession: AuthSession = {
      ...session,
      user: updatedUser,
    };
    setStorage(this.sessionKey, updatedSession);

    return { success: true, user: updatedUser };
  }

  /**
   * Change user password
   */
  changePassword(
    oldPassword: string,
    newPassword: string
  ): { success: boolean; error?: string } {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    if (user.password !== oldPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    return this.updateCurrentUser({ password: newPassword }).success
      ? { success: true }
      : { success: false, error: 'Failed to update password' };
  }

  /**
   * Forgot password (mock - just returns success)
   */
  forgotPassword(email: string): { success: boolean; error?: string } {
    const users = getStorage<User[]>(this.usersKey, []) || [];
    const userExists = users.some((u) => u.email === email);

    if (!userExists) {
      // Don't reveal if email exists for security
      return { success: true };
    }

    // In a real app, we'd send an email with a reset link
    return { success: true };
  }

  /**
   * Reset password (mock - simplified)
   */
  resetPassword(email: string, newPassword: string): { success: boolean; error?: string } {
    const users = getStorage<User[]>(this.usersKey, []) || [];
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    users[userIndex].password = newPassword;
    setStorage(this.usersKey, users);

    return { success: true };
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers(): User[] {
    return getStorage<User[]>(this.usersKey, []) || [];
  }

  /**
   * Get user by ID (admin only)
   */
  getUserById(id: string): User | undefined {
    const users = getStorage<User[]>(this.usersKey, []) || [];
    return users.find((u) => u.id === id);
  }

  /**
   * Update user (admin only)
   */
  updateUser(id: string, updates: Partial<User>): { success: boolean; user?: User; error?: string } {
    const users = getStorage<User[]>(this.usersKey, []) || [];
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    setStorage(this.usersKey, users);

    return { success: true, user: updatedUser };
  }

  /**
   * Delete user (admin only)
   */
  deleteUser(id: string): { success: boolean; error?: string } {
    const users = getStorage<User[]>(this.usersKey, []) || [];
    const filtered = users.filter((u) => u.id !== id);

    if (filtered.length === users.length) {
      return { success: false, error: 'User not found' };
    }

    setStorage(this.usersKey, filtered);
    return { success: true };
  }
}

export const authService = new AuthService();
