/**
 * Client-side authentication storage utilities
 * Handles localStorage operations safely with SSR considerations
 */

const USER_ID_KEY = 'conceptual_user_id'
const ACCESS_TOKEN_KEY = 'conceptual_access_token'
const REFRESH_TOKEN_KEY = 'conceptual_refresh_token'

/**
 * Get the current user ID from localStorage
 * Returns null if not found or if running on server
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  try {
    return localStorage.getItem(USER_ID_KEY)
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

/**
 * Set the user ID in localStorage
 */
export function setUserId(userId: string): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem(USER_ID_KEY, userId)
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

/**
 * Remove the user ID from localStorage
 */
export function removeUserId(): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.removeItem(USER_ID_KEY)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

/**
 * Get the access token from localStorage
 * Returns null if not found or if running on server
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  } catch (error) {
    console.error('Error reading access token from localStorage:', error)
    return null
  }
}

/**
 * Set the access token in localStorage
 */
export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } catch (error) {
    console.error('Error writing access token to localStorage:', error)
  }
}

/**
 * Get the refresh token from localStorage
 * Returns null if not found or if running on server
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error('Error reading refresh token from localStorage:', error)
    return null
  }
}

/**
 * Set the refresh token in localStorage
 */
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } catch (error) {
    console.error('Error writing refresh token to localStorage:', error)
  }
}

/**
 * Remove all authentication data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.removeItem(USER_ID_KEY)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error('Error clearing auth data from localStorage:', error)
  }
}

/**
 * Check if user is authenticated (has tokens)
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null && getRefreshToken() !== null
}

