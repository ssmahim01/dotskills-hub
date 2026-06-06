/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getCurrentUser = async () => {
  const cookieStore = await cookies(); 
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const decoded: any = jwt.decode(accessToken);

    return decoded?.user || {
      _id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
};
