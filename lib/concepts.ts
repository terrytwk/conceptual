import { api } from './api';
import { AxiosError } from 'axios';

/**
 * Concept Registration API functions
 */

export interface ReserveNameRequest {
    uniqueName: string;
    owner: string;
}

export interface ReserveNameResponse {
    concept: string;
}

export interface PublishVersionRequest {
    concept: string;
    semver: string;
    artifactUrl: string;
}

export interface PublishVersionResponse {
    version: string;
}

export interface RegisterUploadRequest {
    uniqueName: string;
    url: string;
    author: string;
}

export interface RegisterUploadResponse {
    id: string;
}

export interface ApiError {
    error: string;
}

export interface ConceptVersion {
    version: string;
    semver: string;
    artifactUrl: string;
    status: string;
    publishedAt: string;
}

export interface ConceptItem {
    concept: string;
    uniqueName: string;
    owner: string;
    versions: ConceptVersion[];
}

export interface ConceptUniqueName {
    uniqueName: string;
}

export interface ConceptOwner {
    owner: string;
}

export interface ConceptLatestVersion {
    version: string;
}

/**
 * Reserve a unique name for a concept
 */
export async function reserveConceptName(uniqueName: string, owner: string): Promise<string> {
    try {
        const response = await api.post<ReserveNameResponse>('/ConceptRegistering/reserveName', {
            uniqueName,
            owner,
        });
        return response.data.concept;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data as ApiError;
            throw new Error(apiError.error || 'Failed to reserve concept name');
        }
        throw new Error('Failed to reserve concept name. Please try again.');
    }
}

/**
 * Publish a version of a concept
 */
export async function publishConceptVersion(
    concept: string,
    semver: string,
    artifactUrl: string
): Promise<string> {
    try {
        const response = await api.post<PublishVersionResponse>('/ConceptRegistering/publishVersion', {
            concept,
            semver,
            artifactUrl,
        });
        return response.data.version;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data as ApiError;
            throw new Error(apiError.error || 'Failed to publish concept version');
        }
        throw new Error('Failed to publish concept version. Please try again.');
    }
}

/**
 * Upload/register a concept file (simplified version)
 */
export async function registerConcept(
    uniqueName: string,
    url: string,
    author: string
): Promise<string> {
    try {
        const response = await api.post<RegisterUploadResponse>('/Registering/upload', {
            uniqueName,
            url,
            author,
        });
        return response.data.id;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data as ApiError;
            throw new Error(apiError.error || 'Failed to register concept');
        }
        throw new Error('Failed to register concept. Please try again.');
    }
}

/**
 * Get all concepts from the registry with their associated versions
 */
export async function getAllConcepts(): Promise<ConceptItem[]> {
    try {
        const response = await api.post<ConceptItem[]>('/ConceptRegistering/_getAll', {});
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data as ApiError;
            throw new Error(apiError.error || 'Failed to fetch concepts');
        }
        throw new Error('Failed to fetch concepts. Please try again.');
    }
}

/**
 * Get the unique name of a concept
 */
export async function getConceptUniqueName(concept: string): Promise<string> {
    try {
        const response = await api.post<ConceptUniqueName[]>('/ConceptRegistering/_getUniqueName', {
            concept,
        });
        return response.data[0]?.uniqueName || concept;
    } catch (error) {
        // If error, return the concept ID as fallback
        return concept;
    }
}

/**
 * Get the owner of a concept
 */
export async function getConceptOwner(concept: string): Promise<string> {
    try {
        const response = await api.post<ConceptOwner[]>('/ConceptRegistering/_getOwner', {
            concept,
        });
        return response.data[0]?.owner || '';
    } catch (error) {
        return '';
    }
}

/**
 * Get the latest published version of a concept
 */
export async function getConceptLatestVersion(concept: string): Promise<string | null> {
    try {
        const response = await api.post<ConceptLatestVersion[]>('/ConceptRegistering/_latestPublished', {
            concept,
        });
        return response.data[0]?.version || null;
    } catch (error) {
        return null;
    }
}

