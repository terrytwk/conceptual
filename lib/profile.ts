import { api } from './api';
import { AxiosError } from 'axios';

/**
 * User Profile API functions
 */

export interface ProfileOfRequest {
    user: string;
}

export interface ProfileOfResponse {
    username: string;
    displayName: string;
    avatarUrl: string;
    bio: string;
}

export interface SetProfileRequest {
    user: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
}

export interface SetProfileResponse {
    ok: boolean;
}

export interface ApiError {
    error: string;
}

/**
 * Get profile information for a user
 * @param userId - User ID
 * @returns Profile information (username, displayName, avatarUrl, bio)
 * @throws Error with message if request fails
 */
export async function getProfile(userId: string): Promise<ProfileOfResponse> {
    try {
        const response = await api.post<ProfileOfResponse[]>('/UserProfileDisplaying/_profileOf', {
            user: userId,
        });
        
        // API returns an array, get first element
        const profile = response.data[0];
        
        // If no profile exists, return empty strings
        if (!profile) {
            return {
                username: '',
                displayName: '',
                avatarUrl: '',
                bio: '',
            };
        }
        
        return profile;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data as ApiError;
            throw new Error(apiError.error || 'Failed to fetch profile');
        }
        throw new Error('Failed to fetch profile. Please try again.');
    }
}

/**
 * Set or update profile fields for a user
 * @param userId - User ID
 * @param profile - Profile fields to update (all optional)
 * @returns Success response
 * @throws Error with message if update fails
 */
export async function setProfile(
    userId: string,
    profile: {
        username?: string;
        displayName?: string;
        avatarUrl?: string;
        bio?: string;
    }
): Promise<SetProfileResponse> {
    try {
        const requestBody: SetProfileRequest = {
            user: userId,
        };
        
        // Only include fields that are provided
        if (profile.username !== undefined) requestBody.username = profile.username;
        if (profile.displayName !== undefined) requestBody.displayName = profile.displayName;
        if (profile.avatarUrl !== undefined) requestBody.avatarUrl = profile.avatarUrl;
        if (profile.bio !== undefined) requestBody.bio = profile.bio;
        
        const response = await api.post<SetProfileResponse>('/UserProfileDisplaying/setProfile', requestBody);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data as ApiError;
            throw new Error(apiError.error || 'Failed to update profile');
        }
        throw new Error('Failed to update profile. Please try again.');
    }
}

