/**
 * Client-side authentication storage utilities
 * Handles localStorage operations safely with SSR considerations
 */

const USER_ID_KEY = 'conceptual_user_id'

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
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getUserId() !== null
}

