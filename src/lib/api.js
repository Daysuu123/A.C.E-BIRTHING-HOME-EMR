export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function postJson(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    // non-JSON response
  }
  return { ok: response.ok, data };
}


