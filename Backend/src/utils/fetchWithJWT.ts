export function fetchWithJWT(url, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem('jwt_token') : null
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  return fetch(url, { ...options, headers })
}
