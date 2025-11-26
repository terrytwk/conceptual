"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getUserId, setUserId, removeUserId } from '@/lib/auth-storage'

interface AuthContextType {
  userId: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userId: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUserId = getUserId()
    setUserIdState(storedUserId)
    setIsLoading(false)
  }, [])

  const login = useCallback((newUserId: string) => {
    setUserId(newUserId)
    setUserIdState(newUserId)
  }, [])

  const logout = useCallback(() => {
    removeUserId()
    setUserIdState(null)
    router.push('/')
  }, [router])

  const value: AuthContextType = {
    userId,
    isAuthenticated: userId !== null,
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

