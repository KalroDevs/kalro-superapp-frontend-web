import React, { createContext, useContext, useCallback, useMemo } from 'react'
import api from '../services/api'

const ApiContext = createContext(null)

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}

export const ApiProvider = ({ children }) => {
  // Auth API methods with bound function wrappers
  const auth = useMemo(() => ({
    register: (...args) => api.auth.register(...args),
    login: (...args) => api.auth.login(...args),
    logout: (...args) => api.auth.logout(...args),
    refreshToken: (...args) => api.auth.refreshToken(...args),
    getProfile: (...args) => api.auth.getProfile(...args),
    updateProfile: (...args) => api.auth.updateProfile(...args),
    changePassword: (...args) => api.auth.changePassword(...args),
    getUsers: (...args) => api.auth.getUsers(...args),
  }), [])

  // Store API methods
  const store = useMemo(() => ({
    getProducts: (...args) => api.store.getProducts(...args),
    getFeaturedProducts: (...args) => api.store.getFeaturedProducts(...args),
    getProductBySlug: (...args) => api.store.getProductBySlug(...args),
    getProductById: (...args) => api.store.getProductById(...args),
    searchProducts: (...args) => api.store.searchProducts(...args),
    getRelatedProducts: (...args) => api.store.getRelatedProducts(...args),
    getProductReviews: (...args) => api.store.getProductReviews(...args),
    addReview: (...args) => api.store.addReview(...args),
    toggleFavorite: (...args) => api.store.toggleFavorite(...args),
    getFavorites: (...args) => api.store.getFavorites(...args),
    trackDownload: (...args) => api.store.trackDownload(...args),
    getCategories: (...args) => api.store.getCategories(...args),
    getStats: (...args) => api.store.getStats(...args),
  }), [])

  // Products API methods (Admin/CMS)
  const products = useMemo(() => ({
    getProducts: (...args) => api.products.getProducts(...args),
    getProductBySlug: (...args) => api.products.getProductBySlug(...args),
    getCategories: (...args) => api.products.getCategories(...args),
    getFeaturedProducts: (...args) => api.products.getFeaturedProducts(...args),
  }), [])

  // Token API methods
  const token = useMemo(() => ({
    getAccessToken: (...args) => api.token.getAccessToken(...args),
    getRefreshToken: (...args) => api.token.getRefreshToken(...args),
    setTokens: (...args) => api.token.setTokens(...args),
    clearTokens: (...args) => api.token.clearTokens(...args),
    isAuthenticated: (...args) => api.token.isAuthenticated(...args),
    refresh: (...args) => api.token.refresh(...args),
  }), [])

  // Helper function to format API errors into user-friendly strings
  const handleApiError = useCallback((error, fallbackMessage = 'An error occurred') => {
    if (import.meta.env.DEV) {
      console.error('📡 Context Caught API Error:', error)
    }

    if (!error) return fallbackMessage
    if (error.status === 401) return 'Your session has expired. Please login again.'
    if (error.status === 403) return 'You do not have permission to perform this action.'
    if (error.status === 404) return 'The requested resource was not found.'
    if (error.status === 0 || error.code === 'NETWORK_ERROR') {
      return 'Network error. Please check your connection.'
    }

    return error.message || fallbackMessage
  }, [])

  // Generic fetch wrapper with clean error extraction
  const fetchWithErrorHandling = useCallback(
    async (apiCall, errorMessage = 'Operation failed') => {
      try {
        const result = await apiCall()
        return { data: result, error: null, success: true, status: 200 }
      } catch (error) {
        const message = handleApiError(error, errorMessage)
        return {
          data: null,
          error: message,
          success: false,
          status: error?.status || 500,
          rawError: error,
        }
      }
    },
    [handleApiError]
  )

  // Memoize top-level context payload to avoid cascading re-renders across subscribers
  const contextValue = useMemo(
    () => ({
      auth,
      store,
      products,
      token,
      handleApiError,
      fetchWithErrorHandling,
      api,
    }),
    [auth, store, products, token, handleApiError, fetchWithErrorHandling]
  )

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  )
}

export default ApiContext