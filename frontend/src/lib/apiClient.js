const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Core fetch wrapper that automatically handles JSON headers,
 * auth tokens, and response error parsing.
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  // 1. Prepare default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // 2. Automatically attach Auth Token if it exists in LocalStorage
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  // 3. Stringify body data if it's sent as a plain object
  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // 4. Handle Non-2xx HTTP Errors cleanly
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `HTTP error! status: ${response.status}`;

      // A rejected token means the stored session is stale: let the app sign out
      if (response.status === 401 && token) {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }

      throw new Error(errorMessage);
    }

    // Return empty object for 244 No Content, otherwise parse JSON
    if (response.status === 204) return {};
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error; // Re-throw so your React component or hook can catch it
  }
}

// Named HTTP method exports to make usage clean and simple
export const apiClient = {
  get: (endpoint, options) => request(endpoint, { method: "GET", ...options }),
  post: (endpoint, body, options) =>
    request(endpoint, { method: "POST", body, ...options }),
  put: (endpoint, body, options) =>
    request(endpoint, { method: "PUT", body, ...options }),
  patch: (endpoint, body, options) =>
    request(endpoint, { method: "PATCH", body, ...options }),
  delete: (endpoint, body, options) =>
    request(endpoint, { method: "DELETE", body, ...options }),
};
