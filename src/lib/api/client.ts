import { config } from '~/lib/config';
import { ApiError } from './types';
import type { RequestConfig } from './types';

async function request<T>(
  endpoint: string,
  { params, body, ...init }: RequestConfig = {},
): Promise<T> {
  const url = new URL(endpoint, config.apiBaseUrl);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      (error as Record<string, string>).code ?? 'UNKNOWN',
      (error as Record<string, string>).message ?? response.statusText,
    );
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export const api = {
  get<T>(endpoint: string, config?: RequestConfig) {
    return request<T>(endpoint, { ...config, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
    return request<T>(endpoint, { ...config, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
    return request<T>(endpoint, { ...config, method: 'PUT', body });
  },

  del<T>(endpoint: string, config?: RequestConfig) {
    return request<T>(endpoint, { ...config, method: 'DELETE' });
  },
};
