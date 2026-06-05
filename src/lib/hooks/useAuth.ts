"use client";

import { useState, useCallback, useEffect } from "react";
import { User, AuthSession } from "../../types/auth.types";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";

interface UseAuthReturn {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "super-admin" | "store-owner",
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (
    updates: Partial<User>,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    authService.initialize();
    userService.initialize();

    const currentSession = authService.getCurrentSession();
    setTimeout(() => {
      if (currentSession && authService.isAuthenticated()) {
        setSession(currentSession);
        setUser(currentSession.user);
      }
      setIsLoading(false);
    }, 100);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = authService.login({ email, password });
      if (result.success && result.session) {
        setSession(result.session);
        setUser(result.session.user);

        // Update last login
        userService.updateLastLogin(result.session.user.id);

        return { success: true };
      }
      return { success: false, error: result.error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: "super-admin" | "store-owner",
    ) => {
      setIsLoading(true);
      try {
        const result = authService.register({
          name,
          email,
          password,
          confirmPassword: password,
          role,
        });
        if (result.success && result.user) {
          const newSession = authService.getCurrentSession();
          if (newSession) {
            setSession(newSession);
            setUser(newSession.user);
          }
          return { success: true };
        }
        return { success: false, error: result.error };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout();
    setSession(null);
    setUser(null);
  }, []);

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      if (!user) return { success: false, error: "Not authenticated" };

      const result = authService.updateCurrentUser(updates);
      if (result.success && result.user) {
        setUser(result.user);
        const newSession = authService.getCurrentSession();
        if (newSession) {
          setSession(newSession);
        }
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    [user],
  );

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && authService.isAuthenticated(),
    login,
    register,
    logout,
    updateUser,
  };
}
