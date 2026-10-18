// Accept an origin or a URL ending in /api, with or without a trailing slash.
const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

export function apiUrl(endpoint) {
  const path = endpoint.replace(/^\/?api(?=\/|$)/, '').replace(/^\/+/, '');
  return `${baseUrl}/api/${path}`;
}

export function fetchApi(endpoint, options = {}, token) {
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  // The browser supplies the boundary for multipart uploads.
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(apiUrl(endpoint), { ...options, headers });
}

export async function readJson(response) {
  const data = await response.json();
  if (!response.ok) {
    const message =
      typeof data.detail === 'string' ? data.detail : 'The request failed. Please try again.';
    throw new Error(message);
  }
  return data;
}
