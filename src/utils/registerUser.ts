/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"

import config from "@/config";

export const registerUser = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData.entries());

    const res = await fetch(`${config.baseUrl}/user/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    // console.log("REsult ", result)

    // 🔥 important fix
    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Registration failed"
      };
    }

    return result;

  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error?.message || "Registration failed"
    };
  }
};