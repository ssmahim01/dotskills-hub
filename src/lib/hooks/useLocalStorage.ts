"use client";

import { useState, useCallback, useEffect } from "react";

interface UseLocalStorageReturn<T> {
  value: T | null;
  isLoading: boolean;
  setValue: (value: T | ((prev: T | null) => T)) => void;
  removeValue: () => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T | null>(initialValue ?? null);
  const [isLoading, setIsLoading] = useState(true);

  // Read value from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
        return;
      }

      const item = window.localStorage.getItem(key);
      if (item) {
        setTimeout(() => {
          setValue(JSON.parse(item) as T);
        }, 100);
      } else if (initialValue !== undefined) {
        setTimeout(() => {
          setValue(initialValue);
        }, 100);
      }
    } catch (error) {
      console.error(
        `[v0] Error reading from localStorage key "${key}":`,
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue]);

  const handleSetValue = useCallback(
    (newValue: T | ((prev: T | null) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(
          `[v0] Error writing to localStorage key "${key}":`,
          error,
        );
      }
    },
    [key, value],
  );

  const removeValue = useCallback(() => {
    try {
      setValue(null);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(
        `[v0] Error removing from localStorage key "${key}":`,
        error,
      );
    }
  }, [key]);

  return {
    value,
    isLoading,
    setValue: handleSetValue,
    removeValue,
  };
}
