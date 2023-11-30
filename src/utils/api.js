import { getCookie } from './utils';
import { BACKEND_API_URL } from '../constants'

export async function backendFetchUrl(url, options = {}) {
  const token = getCookie('corplearntoken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  return fetch(BACKEND_API_URL + url, { ...options, headers });
}
