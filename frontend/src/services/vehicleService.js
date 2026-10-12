// Resilient API client supporting both relative proxy, online tunnels, and direct backend endpoints
const ENV_BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const PRIMARY_BASE = ENV_BACKEND_URL ? `${ENV_BACKEND_URL}/api/vehicles` : '/api/vehicles';
const LOCAL_FALLBACK_BASE = 'http://localhost:8080/api/vehicles';

function isLocalhost() {
  if (typeof window === 'undefined') return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
}

async function executeRequest(endpointPath, options = {}) {
  // First attempt via primary base (/api/vehicles or VITE_API_BASE_URL)
  try {
    const res = await fetch(`${PRIMARY_BASE}${endpointPath}`, options);
    return await handleResponse(res);
  } catch (err) {
    // If it's not a network fetch error (e.g., custom HTTP status error), rethrow it
    if (err.status || err.errors) {
      throw err;
    }

    // Only attempt localhost:8080 fallback if the client is actually running on localhost
    // (Prevents Mixed Content HTTPS blocks and cross-device connection errors online)
    if (isLocalhost() && !ENV_BACKEND_URL) {
      try {
        const fallbackRes = await fetch(`${LOCAL_FALLBACK_BASE}${endpointPath}`, options);
        return await handleResponse(fallbackRes);
      } catch (fallbackErr) {
        if (fallbackErr.status || fallbackErr.errors) {
          throw fallbackErr;
        }
      }
    }

    // Failed to reach server
    const target = ENV_BACKEND_URL || (isLocalhost() ? 'localhost:8080' : window.location.origin);
    const connectionError = new Error(
      `Backend service unreachable at ${target}. Verify your Render backend is running and VITE_API_BASE_URL is configured in Vercel.`
    );
    connectionError.isConnectionError = true;
    throw connectionError;
  }
}

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.message || `Request failed with status ${res.status} (${res.statusText})`;
    const error = new Error(message);
    error.status = res.status;
    error.errors = errorData.errors || {};
    throw error;
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return { success: true };
  }

  return res.json();
}

export const vehicleService = {
  async getAll({ search = '', status = '', type = '' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (type) params.append('type', type);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return executeRequest(queryString);
  },

  async getById(id) {
    return executeRequest(`/${id}`);
  },

  async getByVin(vin) {
    return executeRequest(`/vin/${encodeURIComponent(vin)}`);
  },

  async getSummary() {
    return executeRequest('/summary');
  },

  async create(vehicle) {
    return executeRequest('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
  },

  async update(id, vehicle) {
    return executeRequest(`/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
  },

  async updateStatus(id, status) {
    return executeRequest(`/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  },

  async delete(id) {
    return executeRequest(`/${id}`, {
      method: 'DELETE',
    });
  },
};
