import { authClient } from "./auth-client";
import type { ApiResponse, ApiErrorResponse } from "@/types/api.types";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const BACKEND_BASE_URL = RAW_API_URL.endsWith("/api/v1")
  ? RAW_API_URL
  : `${RAW_API_URL.replace(/\/+$/, "")}/api/v1`;

// When running in the browser, route through the local Next.js proxy (/api/proxy)
// so that HTTP cookies (better-auth session tokens) are automatically attached by the browser.
// On the server side (SSR / Server Components), call the backend directly.
const BASE_URL =
  typeof window !== "undefined"
    ? "/api/proxy"
    : BACKEND_BASE_URL;

export class ApiError extends Error {
  statusCode: number;
  errors?: ApiErrorResponse["errors"];

  constructor(
    message: string,
    statusCode: number,
    errors?: ApiErrorResponse["errors"]
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  let token: string | undefined;
  try {
    const sessionResult = await authClient.getSession();
    token = sessionResult?.data?.session?.token;
  } catch {
    // ignore
  }

  const isFormData = typeof FormData !== "undefined" && restOptions.body instanceof FormData;

  const reqHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const response = await fetch(url, {
    credentials: "include",
    ...restOptions,
    headers: reqHeaders,
  });

  let responseData: ApiResponse<T> | ApiErrorResponse;
  try {
    responseData = await response.json();
  } catch {
    throw new ApiError(
      response.statusText || "Failed to parse JSON response from server",
      response.status
    );
  }

  if (!response.ok || !responseData.success) {
    const errorData = responseData as ApiErrorResponse;
    const detailMsg =
      errorData.errors && errorData.errors.length > 0
        ? errorData.errors
            .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
            .join("; ")
        : "";
    const finalMessage = detailMsg
      ? `${errorData.message || "Validation failed"}: ${detailMsg}`
      : errorData.message || "An unexpected error occurred";

    throw new ApiError(
      finalMessage,
      response.status,
      errorData.errors
    );
  }

  return (responseData as ApiResponse<T>).data;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: "POST",
      body:
        typeof FormData !== "undefined" && body instanceof FormData
          ? body
          : body !== undefined
          ? JSON.stringify(body)
          : undefined,
      ...options,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: "PATCH",
      body:
        typeof FormData !== "undefined" && body instanceof FormData
          ? body
          : body !== undefined
          ? JSON.stringify(body)
          : undefined,
      ...options,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};
