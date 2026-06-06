"use server"

import { deleteCookie } from "./tokenHandlers";

export const logoutUser = async () => {
    await deleteCookie("refreshToken");
    await deleteCookie("accessToken");
}