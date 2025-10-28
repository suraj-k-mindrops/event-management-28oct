const BASE_URL = (import.meta?.env?.VITE_API_URL || 'http://localhost:5000') + '/api';

function getToken() {
  try {
    return localStorage.getItem('auth_token');
  } catch (_) {
    return null;
  }
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${BASE_URL}${path}`;
  const token = getToken();

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    throw new Error('unauthorized');
  }

  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const err = await response.json();
      if (err?.message) errorMessage = err.message;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch (_) {
    return null;
  }
}

export async function loginApi(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function getEventsApi() {
  return request('/events', { method: 'GET' });
}

export async function createEventApi(data) {
  return request('/events', { method: 'POST', body: data });
}

export { getToken };


