import { Platform } from 'react-native';

const fallbackUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
const baseUrl = (process.env.EXPO_PUBLIC_API_URL || fallbackUrl)
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

export function apiUrl(endpoint: string): string {
  const path = endpoint.replace(/^\/?api(?=\/|$)/, '').replace(/^\/+/, '');
  return `${baseUrl}/api/${path}`;
}

export function fetchApi(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(apiUrl(endpoint), { ...options, headers });
}

export async function readJson(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    const message =
      typeof data.detail === 'string' ? data.detail : 'The request failed. Please try again.';
    throw new Error(message);
  }
  return data;
}
