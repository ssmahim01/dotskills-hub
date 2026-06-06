import config from "@/config";
import { getCookie } from "./tokenHandlers";

const BACKEND_API_URL = config.baseUrl

const serverFetchHelper = async (endpoint: string, options: RequestInit): Promise<Response> => {
    const { headers, ...restOptions } = options;
    const accessToken = await getCookie("accessToken");
    const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
        headers: {
            Cookie: accessToken ? `accessToken=${accessToken}` : "",
            ...headers,
            // ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
            // ...(accessToken ? { "Authorization": accessToken } : {}),

        },
        ...restOptions,
    })

    return response;
}

export const serverFetch = {
    get: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "GET" }),

    post: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "POST" }),

    put: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "PUT" }),

    patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

    delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "DELETE" }),

}


// import config from "@/config";

// const BACKEND_API_URL = config.baseUrl;

// type FetchOptions = RequestInit & {
//   tags?: string[];
// };

// const serverFetchHelper = async (
//   endpoint: string,
//   options: FetchOptions = {}
// ): Promise<Response> => {
//   const { headers, tags, ...restOptions } = options;

//   return fetch(`${BACKEND_API_URL}${endpoint}`, {
//     ...restOptions,
//     headers: {
//       ...headers,
//     },
//     next: tags
//       ? {
//           tags, // ✅ tag based on-demand ISR
//         }
//       : undefined,
//   });
// };

// export const serverFetch = {
//   get: (endpoint: string, tags?: string[]) =>
//     serverFetchHelper(endpoint, { method: "GET", tags }),

//   post: (endpoint: string, body?: any) =>
//     serverFetchHelper(endpoint, {
//       method: "POST",
//       body: JSON.stringify(body),
//       headers: { "Content-Type": "application/json" },
//     }),

//   put: (endpoint: string, body?: any) =>
//     serverFetchHelper(endpoint, {
//       method: "PUT",
//       body: JSON.stringify(body),
//       headers: { "Content-Type": "application/json" },
//     }),

//   patch: (endpoint: string, body?: any) =>
//     serverFetchHelper(endpoint, {
//       method: "PATCH",
//       body: JSON.stringify(body),
//       headers: { "Content-Type": "application/json" },
//     }),

//   delete: (endpoint: string) =>
//     serverFetchHelper(endpoint, { method: "DELETE" }),
// };
