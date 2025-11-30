"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getUserId, 
  setUserId, 
  getAccessToken, 
  setAccessToken, 
  getRefreshToken, 
  setRefreshToken, 
  clearAuthData,
  isAuthenticated as checkIsAuthenticated
} from '@/lib/auth-storage'
import { getUserFromToken, logout as logoutApi, refreshTokens } from '@/lib/auth'

interface AuthContextType {
  userId: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userId: string, accessToken: string, refreshToken: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Token refresh interval: 14 minutes (access token expires in 15 minutes)
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Validate token and initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      const accessToken = getAccessToken()
      const refreshToken = getRefreshToken()
      const storedUserId = getUserId()

      if (!accessToken || !refreshToken) {
        // No tokens - clear any stale data
        clearAuthData()
        setUserIdState(null)
        setIsLoading(false)
        return
      }

      // Validate token by getting user
      try {
        const user = await getUserFromToken(accessToken)
        setUserIdState(user)
        setUserId(user)
        
        // Set up automatic token refresh
        setupTokenRefresh()
      } catch (error) {
        // Token invalid - clear auth data
        console.error('Token validation failed:', error)
        clearAuthData()
        setUserIdState(null)
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      clearAuthData()
      setUserIdState(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Set up automatic token refresh
  const setupTokenRefresh = useCallback(() => {
    // Clear existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
    }

    // Set up new interval to refresh token before it expires
    refreshIntervalRef.current = setInterval(async () => {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearAuthData()
        setUserIdState(null)
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current)
        }
        return
      }

      try {
        const { accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshToken)
        setAccessToken(accessToken)
        setRefreshToken(newRefreshToken)
      } catch (error) {
        console.error('Automatic token refresh failed:', error)
        // Refresh failed - clear auth and stop interval
        clearAuthData()
        setUserIdState(null)
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current)
        }
      }
    }, TOKEN_REFRESH_INTERVAL)
  }, [])

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    initializeAuth()

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [initializeAuth])

  const login = useCallback((newUserId: string, accessToken: string, refreshToken: string) => {
    setUserId(newUserId)
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    setUserIdState(newUserId)
    setupTokenRefresh()
  }, [setupTokenRefresh])

  const logout = useCallback(async () => {
    try {
      const accessToken = getAccessToken()
      if (accessToken) {
        await logoutApi(accessToken)
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
      // Continue with local logout even if API call fails
    } finally {
      // Clear interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
      // Clear all auth data
      clearAuthData()
      setUserIdState(null)
      router.push('/')
    }
  }, [router])

  const value: AuthContextType = {
    userId,
    isAuthenticated: checkIsAuthenticated() && userId !== null,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

