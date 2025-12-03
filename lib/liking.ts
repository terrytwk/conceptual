import { api } from './api'
import { AxiosError } from 'axios'

export interface LikeRequest {
  item: string
  user: string
}

export interface LikeResponse {
  ok?: boolean
  error?: string
}

export interface IsLikedResponse {
  liked: boolean
}

export interface CountForItemResponse {
  n: number
}

export interface LikedItemsResponse {
  items: string[]
}

// Helper to unwrap array responses coming from concept queries
function unwrapArrayResponse<T>(data: T[] | T): T {
  if (Array.isArray(data)) return data[0]
  return data
}

export async function like(item: string, user: string): Promise<LikeResponse> {
  try {
    const res = await api.post<LikeResponse>('/Liking/like', { item, user })
    return res.data
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      return error.response.data as LikeResponse
    }
    return { error: 'Failed to like item' }
  }
}

export async function unlike(item: string, user: string): Promise<LikeResponse> {
  try {
    const res = await api.post<LikeResponse>('/Liking/unlike', { item, user })
    return res.data
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      return error.response.data as LikeResponse
    }
    return { error: 'Failed to unlike item' }
  }
}

export async function isLiked(item: string, user: string): Promise<boolean> {
  try {
    const res = await api.post<IsLikedResponse[] | IsLikedResponse>('/Liking/_isLiked', { item, user })
    const data = unwrapArrayResponse(res.data)
    return !!data.liked
  } catch {
    return false
  }
}

export async function countForItem(item: string): Promise<number> {
  try {
    const res = await api.post<CountForItemResponse[] | CountForItemResponse>('/Liking/_countForItem', { item })
    const data = unwrapArrayResponse(res.data)
    return data.n ?? 0
  } catch {
    return 0
  }
}

export async function likedItems(user: string): Promise<string[]> {
  try {
    const res = await api.post<LikedItemsResponse[] | LikedItemsResponse>('/Liking/_likedItems', { user })
    const data = unwrapArrayResponse(res.data)
    return data.items ?? []
  } catch {
    return []
  }
}
