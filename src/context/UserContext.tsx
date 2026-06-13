/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { logoutUser } from "@/utils/logoutUser";
import { useRouter } from "next/navigation";
import { useGetMyStoreQuery } from "@/redux/features/Store/store.api";

type User = {
  _id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "OWNER" | "STAFF" | "CUSTOMER";
};

type UserContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: myStore } = useGetMyStoreQuery();

  useEffect(() => {
    const hydrateUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    hydrateUser();
  }, []);

  const login = (userData: any) => {
    setUser(userData);

    router.push(`/${myStore?.data?.slug}/dashboard`);
  };
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
