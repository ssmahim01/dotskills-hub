/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { parse } from "cookie"
import { setCookie } from "./tokenHandlers";
import config from "@/config";

export const loginUser = async (data: any): Promise<any> => {
    try {

        let accessTokenObject: null | any = null;
        let refreshTokenObject: null | any = null;

        const res = await fetch(`${config.baseUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json"
            }
        })

        const result = await res.json();

        // console.log(result)
 
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Invalid email or password",
            };
        }
        const setCookieHeaders = res.headers.getSetCookie();

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie: string) => {

                const parsedCookie = parse(cookie)
                if (parsedCookie["accessToken"]) {
                    accessTokenObject = parsedCookie;
                }

                if (parsedCookie["refreshToken"]) {
                    refreshTokenObject = parsedCookie;
                }

            })
        } else {
            throw new Error("No set-cookie header found")
        }

        if (!accessTokenObject) {
            throw new Error("Tokens not found in cookies");
        }

        if (!refreshTokenObject) {
            throw new Error("Tokens not found in cookies");
        }

        await setCookie("accessToken", accessTokenObject.accessToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(accessTokenObject['Max-Age']) || 1000 * 60 * 60 * 24,
            path: accessTokenObject.Path || "/",
            sameSite: accessTokenObject['SameSite'] || "none",
        });

        await setCookie("refreshToken", refreshTokenObject.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(refreshTokenObject['Max-Age']) || 1000 * 60 * 60 * 24 * 30,
            path: refreshTokenObject.Path || "/",
            sameSite: refreshTokenObject['SameSite'] || "none",
        });

        if (result.success && accessTokenObject.accessToken) {
            return { success: true, user: result.data };
        }


    } catch (e: any) {
        return { success: false, message: e.message };
    }
}