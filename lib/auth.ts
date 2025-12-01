import { api } from './api';
import { AxiosError } from 'axios';

/**
 * Authentication API functions
 */

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: string;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
    username?: string;
    bio?: string;
}

export interface RegisterResponse {
    user: string;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export interface LogoutResponse {
    status: string;
}

export interface GetUserResponse {
    user: string;
}

export interface AuthError {
    error: string;
}

/**
 * Login a user
 * @param email - User email
 * @param password - User password
 * @returns Auth response with user ID and tokens
 * @throws Error with message if login fails
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await api.post<LoginResponse>('/auth/login', {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const authError = error.response.data as AuthError;
            throw new Error(authError.error || 'Login failed');
        }
        throw new Error('Login failed. Please try again.');
    }
}

/**
 * Register a new user
 * @param email - User email
 * @param password - User password
 * @param name - User's full name (optional)
 * @param username - User's username (optional)
 * @param bio - User's bio (optional)
 * @returns Auth response with user ID and tokens
 * @throws Error with message if registration fails
 */
export async function register(
    email: string, 
    password: string, 
    name?: string, 
    username?: string, 
    bio?: string
): Promise<RegisterResponse> {
    try {
        const requestBody: RegisterRequest = {
            email,
            password,
        };
        
        // Only include optional fields if they are provided
        if (name) requestBody.name = name;
        if (username) requestBody.username = username;
        if (bio) requestBody.bio = bio;
        
        const response = await api.post<RegisterResponse>('/auth/register', requestBody);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const authError = error.response.data as AuthError;
            throw new Error(authError.error || 'Registration failed');
        }
        throw new Error('Registration failed. Please try again.');
    }
}

/**
 * Refresh access token using refresh token
 * @param refreshToken - Refresh token
 * @returns New access and refresh tokens
 * @throws Error with message if refresh fails
 */
export async function refreshTokens(refreshToken: string): Promise<RefreshResponse> {
    try {
        const response = await api.post<RefreshResponse>('/auth/refresh', {
            refreshToken,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const authError = error.response.data as AuthError;
            throw new Error(authError.error || 'Token refresh failed');
        }
        throw new Error('Token refresh failed. Please try again.');
    }
}

/**
 * Logout a user
 * @param accessToken - Access token to revoke (sent in Authorization header)
 * @throws Error with message if logout fails
 */
export async function logout(accessToken: string): Promise<void> {
    try {
        await api.post<LogoutResponse>(
            '/auth/logout',
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const authError = error.response.data as AuthError;
            throw new Error(authError.error || 'Logout failed');
        }
        // Don't throw on logout failure - still clear local storage
        console.error('Logout API call failed:', error);
    }
}

/**
 * Get user from access token
 * @param accessToken - Access token to validate (sent in Authorization header)
 * @returns User ID if token is valid
 * @throws Error with message if token is invalid
 */
export async function getUserFromToken(accessToken: string): Promise<string> {
    try {
        const response = await api.post<GetUserResponse>(
            '/auth/_getUser',
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data.user;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const authError = error.response.data as AuthError;
            throw new Error(authError.error || 'Token validation failed');
        }
        throw new Error('Token validation failed. Please try again.');
    }
}

