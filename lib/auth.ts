import { api } from './api';
import { AxiosError } from 'axios';

/**
 * Authentication API functions
 */

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface RegisterResponse {
    user: string;
}

export interface AuthError {
    error: string;
}

/**
 * Login a user
 * @param username - Username or email
 * @param password - User password
 * @returns User ID if successful
 * @throws Error with message if login fails
 */
export async function login(username: string, password: string): Promise<string> {
    try {
        const response = await api.post<LoginResponse>('/UserAuthenticating/login', {
            username,
            password,
        });
        return response.data.user;
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
 * @param username - Username or email
 * @param password - User password
 * @returns User ID if successful
 * @throws Error with message if registration fails
 */
export async function register(username: string, password: string): Promise<string> {
    try {
        const response = await api.post<RegisterResponse>('/UserAuthenticating/register', {
            username,
            password,
        });
        return response.data.user;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const authError = error.response.data as AuthError;
            throw new Error(authError.error || 'Registration failed');
        }
        throw new Error('Registration failed. Please try again.');
    }
}

