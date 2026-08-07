// API Service - Handles all API calls to the backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://10.101.100.35/api/v1'

// Helper to sanitize query parameters
const buildQueryString = (params = {}) => {
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value
    }
    return acc
  }, {})

  const queryString = new URLSearchParams(cleanParams).toString()
  return queryString ? `?${queryString}` : ''
}

// Default headers generator
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (includeAuth) {
    const token = localStorage.getItem('access_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

// Handle API responses safely
const handleResponse = async (response) => {
  if (response.status === 204) {
    return {}
  }

  if (response.status === 404) {
    let errorMessage = 'Resource not found'
    let errorData = {}
    try {
      errorData = await response.json()
      errorMessage = errorData.detail || errorData.message || 'Resource not found'
    } catch {
      errorMessage = 'The requested resource was not found'
    }
    const error = new Error(errorMessage)
    error.status = 404
    error.data = errorData
    throw error
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred'
    let errorData = {}
    
    try {
      errorData = await response.json()
      errorMessage = 
        errorData.detail ||
        errorData.message ||
        errorData.error ||
        errorData.non_field_errors?.[0] ||
        JSON.stringify(errorData)
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`
    }
    
    const error = new Error(errorMessage)
    error.status = response.status
    error.data = errorData
    throw error
  }

  return response.json()
}

// ============================================================
// REFRESH TOKEN QUEUE LOGIC
// ============================================================

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Generic request function
const request = async (endpoint, options = {}) => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${normalizedEndpoint}`
  const includeAuth = options.includeAuth !== false

  const config = {
    ...options,
    headers: {
      ...getHeaders(includeAuth),
      ...options.headers,
    },
  }

  if (['GET', 'HEAD'].includes(config.method?.toUpperCase())) {
    delete config.body
  } else if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body)
  }

  if (import.meta.env.DEV) {
    console.log(`📡 API Request: ${config.method || 'GET'} ${url}`)
  }

  try {
    const response = await fetch(url, config)

    if (import.meta.env.DEV) {
      console.log(`📡 API Response: ${response.status} ${response.statusText}`)
    }

    if (response.status === 401 && includeAuth && !options._retry && !options._isRefreshRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            config.headers['Authorization'] = `Bearer ${token}`
            return fetch(url, config).then(handleResponse)
          })
          .catch((err) => Promise.reject(err))
      }

      options._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await tokenService.refresh()
        const newAccessToken = refreshResponse.access

        isRefreshing = false
        processQueue(null, newAccessToken)

        config.headers['Authorization'] = `Bearer ${newAccessToken}`
        const retryResponse = await fetch(url, config)
        return handleResponse(retryResponse)
      } catch (refreshError) {
        isRefreshing = false
        processQueue(refreshError, null)
        tokenService.clearTokens()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }
        throw refreshError
      }
    }

    return handleResponse(response)
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      const networkError = new Error('Network error - please check your connection')
      networkError.status = 0
      networkError.code = 'NETWORK_ERROR'
      throw networkError
    }
    
    console.error(`❌ API Error [${endpoint}]:`, error)
    throw error
  }
}

// ============================================================
// AUTHENTICATION SERVICES
// ============================================================

export const authService = {
  register: (userData) =>
    request('/auth/register/', {
      method: 'POST',
      body: userData,
      includeAuth: false,
    }),

  login: (credentials) =>
    request('/auth/login/', {
      method: 'POST',
      body: credentials,
      includeAuth: false,
    }),

  logout: (refreshToken) =>
    request('/auth/logout/', {
      method: 'POST',
      body: { refresh_token: refreshToken },
    }),

  refreshToken: (refreshToken) =>
    request('/auth/token/refresh/', {
      method: 'POST',
      body: { refresh: refreshToken },
      includeAuth: false,
      _isRefreshRequest: true,
    }),

  getProfile: () => request('/auth/profile/'),
  updateProfile: (profileData) =>
    request('/auth/profile/', {
      method: 'PUT',
      body: profileData,
    }),
  changePassword: (passwordData) =>
    request('/auth/change-password/', {
      method: 'POST',
      body: passwordData,
    }),
  getUsers: (params = {}) => request(`/auth/users/${buildQueryString(params)}`),
}

// ============================================================
// STORE SERVICES
// ============================================================

export const storeService = {
  getProducts: (params = {}) =>
    request(`/store/products/${buildQueryString(params)}`, {
      includeAuth: false,
    }),

  getFeaturedProducts: (params = {}) =>
    request(`/store/products/featured/${buildQueryString(params)}`, {
      includeAuth: false,
    }),

  getProductBySlug: (slug) =>
    request(`/store/products/${slug}/`, {
      includeAuth: false,
    }),

  getProductById: (id) =>
    request(`/store/products/${id}/`, {
      includeAuth: false,
    }),

  searchProducts: (params = {}) =>
    request(`/store/products/search/${buildQueryString(params)}`, {
      includeAuth: false,
    }),

  getRelatedProducts: (slug) =>
    request(`/store/products/${slug}/related/`, {
      includeAuth: false,
    }),

  getProductReviews: (slug) =>
    request(`/store/products/${slug}/reviews/`, {
      includeAuth: false,
    }),

  addReview: (slug, reviewData) =>
    request(`/store/products/${slug}/reviews/add/`, {
      method: 'POST',
      body: reviewData,
    }),

  toggleFavorite: (slug) =>
    request(`/store/products/${slug}/favorite/`, {
      method: 'POST',
    }),

  getFavorites: () => request('/store/favorites/'),

  trackDownload: (slug, data = { platform: 'web' }) =>
    request(`/store/products/${slug}/download/`, {
      method: 'POST',
      body: data,
    }),

  getCategories: () =>
    request('/store/categories/', {
      includeAuth: false,
    }),

  getStats: () =>
    request('/store/stats/', {
      includeAuth: false,
    }),
}

// ============================================================
// PRODUCTS SERVICES (Admin/CMS)
// ============================================================

export const productService = {
  getProducts: (params = {}) => request(`/products/${buildQueryString(params)}`),
  getProductBySlug: (slug) => request(`/products/${slug}/`),
  getCategories: () => request('/categories/', { includeAuth: false }),
  getFeaturedProducts: () => request('/products/featured/'),
}

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

export const tokenService = {
  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setTokens: (tokens) => {
    if (tokens.access) {
      localStorage.setItem('access_token', tokens.access)
    }
    if (tokens.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh)
    }
  },
  clearTokens: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
  isAuthenticated: () => !!localStorage.getItem('access_token'),
  refresh: async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    const response = await authService.refreshToken(refreshToken)
    if (response.access) {
      tokenService.setTokens({ access: response.access })
      return response
    }
    throw new Error('Failed to refresh token')
  },
}

// ============================================================
// ERROR HANDLING UTILITIES
// ============================================================

export const isNetworkError = (error) => error?.code === 'NETWORK_ERROR' || error?.status === 0
export const isAuthError = (error) => error?.status === 401
export const isNotFoundError = (error) => error?.status === 404
export const getErrorMessage = (error, fallback = 'An error occurred') => {
  if (isNetworkError(error)) return 'Network error - please check your connection'
  if (isAuthError(error)) return 'Your session has expired. Please login again.'
  if (isNotFoundError(error)) return 'The requested resource was not found'
  return error?.message || fallback
}

// ============================================================
// EXPORT DEFAULT BUNDLE
// ============================================================

export default {
  auth: authService,
  store: storeService,
  products: productService,
  token: tokenService,
  isNetworkError,
  isAuthError,
  isNotFoundError,
  getErrorMessage,
}