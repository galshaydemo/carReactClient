const BASE_URL = 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  me: () => request('/auth/me'),
  updateProfile: (updates) => request('/auth/me', { method: 'PATCH', body: JSON.stringify(updates) }),
  getCars: () => request('/cars'),
  getCar: (id) => request(`/cars/${id}`),
  addCar: (car) => request('/cars', { method: 'POST', body: JSON.stringify(car) }),
  deleteCar: (id) => request(`/cars/${id}`, { method: 'DELETE' }),
  updateCar: (id, updates) => request(`/cars/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  updateKm: (id, km) => request(`/cars/${id}/km`, { method: 'PATCH', body: JSON.stringify({ km }) }),
  getDrivers: () => request('/users'),
  addDriver: (driver) => request('/users', { method: 'POST', body: JSON.stringify(driver) }),
  deleteDriver: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  getMaintenance: (id) => request(`/cars/${id}/maintenance`),
  addMaintenance: (id, entry) =>
    request(`/cars/${id}/maintenance`, { method: 'POST', body: JSON.stringify(entry) }),
  getParking: (id) => request(`/cars/${id}/parking`),
  reportParking: (id, location) =>
    request(`/cars/${id}/parking`, { method: 'POST', body: JSON.stringify(location) }),
};
