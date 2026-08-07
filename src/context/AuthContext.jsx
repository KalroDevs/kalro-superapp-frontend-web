import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)
      const token = api.token.getAccessToken()
      
      if (token) {
        try {
          const response = await api.auth.getProfile()
          if (response.data?.user) {
            setUser(response.data.user)
            setIsAuthenticated(true)
          } else {
            // If no user data, clear tokens
            api.token.clearTokens()
            setIsAuthenticated(false)
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          // If token is invalid, clear it
          if (error.status === 401) {
            api.token.clearTokens()
            setIsAuthenticated(false)
            setUser(null)
          }
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Setup auth listener for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false)
      setUser(null)
      setError('Your session has expired. Please login again.')
      // Redirect to login page
      window.location.href = '/login'
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.auth.login({ email, password })
      
      if (response.data?.tokens) {
        api.token.setTokens(response.data.tokens)
        setUser(response.data.user)
        setIsAuthenticated(true)
        return { success: true, user: response.data.user }
      }
      
      throw new Error('Invalid login response')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
      setIsAuthenticated(false)
      setUser(null)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Register function
  const register = useCallback(async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.auth.register(userData)
      
      if (response.data?.tokens) {
        api.token.setTokens(response.data.tokens)
        setUser(response.data.user)
        setIsAuthenticated(true)
        return { success: true, user: response.data.user }
      }
      
      throw new Error('Invalid registration response')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
      setIsAuthenticated(false)
      setUser(null)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true)
    try {
      const refreshToken = api.token.getRefreshToken()
      if (refreshToken) {
        await api.auth.logout(refreshToken)
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      api.token.clearTokens()
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      // Redirect to home page
      window.location.href = '/'
    }
  }, [])

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.auth.updateProfile(profileData)
      if (response.data?.user) {
        setUser(response.data.user)
        return { success: true, user: response.data.user }
      }
      return { success: true }
    } catch (err) {
      setError(err.message || 'Failed to update profile')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    setLoading(true)
    setError(null)
    try {
      await api.auth.changePassword(passwordData)
      return { success: true }
    } catch (err) {
      setError(err.message || 'Failed to change password')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await api.auth.getProfile()
      if (response.data?.user) {
        setUser(response.data.user)
        setIsAuthenticated(true)
        return response.data.user
      }
    } catch (err) {
      console.error('Failed to refresh user:', err)
      if (err.status === 401) {
        api.token.clearTokens()
        setIsAuthenticated(false)
        setUser(null)
      }
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    setError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext