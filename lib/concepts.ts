import { api } from './api';
import { AxiosError } from 'axios';
import { getAccessToken } from './auth-storage';
// Optional UUID generator for request dedupe. In browsers, fallback to time+random.
let genUUID: () => string = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
try {
    // Node/Edge runtime may provide crypto.randomUUID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyCrypto = (globalThis as any).crypto;
    if (anyCrypto && typeof anyCrypto.randomUUID === 'function') {
        genUUID = () => anyCrypto.randomUUID();
    }
} catch { }

// In-flight guards to prevent duplicate concurrent requests
const publishInFlight = new Set<string>();
const readmeGenInFlight = new Set<string>();

/**
 * Concept Registration API functions
 */

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
    authorUsername: string;
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
 * Parse semver string to version number (non-negative integer)
 * Extracts the major version number from semver (e.g., "1.0.0" -> 1, "2.1.3" -> 2)
 */
export function parseVersionNumber(semver: string): number {
    const parts = semver.trim().split('.');
    const major = parseInt(parts[0], 10);
    if (isNaN(major) || major < 0) {
        throw new Error(`Invalid version number. Expected non-negative integer, got: ${semver}`);
    }
    return major;
}

/**
 * Convert a File to Uint8Array
 */
async function fileToUint8Array(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    return new Uint8Array(arrayBuffer);
}

/**
 * Publish a concept with folder upload using JSON format
 * This uses the /api/registry/publish endpoint which automatically creates concepts
 * and handles versioning (creates version 1 automatically)
 */
export interface PublishConceptWithFolderResponse {
    concept: string;
    version: string;
    unique_name: string;
    ok: boolean;
}

export async function publishConceptWithFolder(
    uniqueName: string,
    files: FileList | File[]
): Promise<string> {
    // Guard: prevent concurrent duplicate publishes for the same uniqueName
    if (publishInFlight.has(uniqueName)) {
        throw new Error('A publish is already in progress for this concept. Please wait.');
    }
    try {
        publishInFlight.add(uniqueName);
        // Convert files to Uint8Array and create files map
        const fileArray = Array.from(files);
        const filesMap: Record<string, number[]> = {};

        // Process each file and convert to Uint8Array
        for (const file of fileArray) {
            // Get file path - use webkitRelativePath if available (from folder selection)
            // Otherwise use just the filename
            const filePath = (file as any).webkitRelativePath || file.name;

            // Convert file to Uint8Array
            const uint8Array = await fileToUint8Array(file);

            // Convert Uint8Array to regular array for JSON serialization
            filesMap[filePath] = Array.from(uint8Array);
        }

        // Prepare request body according to API spec
        const requestBody = {
            unique_name: uniqueName,
            files: filesMap,
            // Include a unique requestId to aid backend idempotency/deduplication
            requestId: genUUID(),
        };

        // Include access token only; do not include concept id here
        const accessToken = getAccessToken();
        const response = await api.post<PublishConceptWithFolderResponse>(
            '/registry/publish',
            accessToken ? { ...requestBody, accessToken } : requestBody
        );
        return response.data.version;
    } catch (error) {
        // Fallback: if the server actually processed the publish but the client errored (e.g., network/timeout),
        // try to detect the latest version and return it.
        try {
            const versions = await getConceptVersions(uniqueName);
            const latest = versions[0]?.version;
            if (typeof latest === 'number') {
                return String(latest);
            }
        } catch { }
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data as ApiError;
            throw new Error(apiError.error || 'Failed to publish concept');
        }
        throw new Error('Failed to publish concept. Please try again.');
    } finally {
        publishInFlight.delete(uniqueName);
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
 * Response type for /api/registry/all endpoint
 */
export interface RegistryConcept {
    concept: string;
    unique_name: string;
    author: string;
    author_username: string;
    created_at: string;
    updated_at: string;
}

export interface RegistryAllResponse {
    results: RegistryConcept[];
}

/**
 * Get all concepts from the registry
 * Uses the /api/registry/all endpoint which returns basic concept information
 */
export async function getAllConcepts(): Promise<ConceptItem[]> {
    try {
        const response = await api.post<RegistryAllResponse>('/registry/all', {});

        // Map the registry response to ConceptItem format
        // Note: versions are not included in the registry/all response
        // If versions are needed, they would need to be fetched separately
        return response.data.results.map((regConcept): ConceptItem => ({
            concept: regConcept.concept,
            uniqueName: regConcept.unique_name,
            owner: regConcept.author,
            authorUsername: regConcept.author_username || '',
            versions: [], // Versions not included in registry/all response
        }));
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data as ApiError;
            throw new Error(apiError.error || 'Failed to fetch concepts');
        }
        throw new Error('Failed to fetch concepts. Please try again.');
    }
}

/**
 * Response for /registry/files endpoint
 * Returns latest version's files as key->content (UTF-8 text)
 */
export interface RegistryFilesResponse {
    files: Record<string, string>;
}

/**
 * Fetch latest version source files for a concept by unique name.
 * Uses /registry/files with body { unique_name }
 */
export async function getConceptFiles(uniqueName: string, version?: number): Promise<Record<string, string>> {
    try {
        const body: { unique_name: string; version?: number } = { unique_name: uniqueName };
        if (typeof version === 'number') body.version = version;
        const response = await api.post<RegistryFilesResponse>("/registry/files", body);
        return response.data.files || {};
    } catch (error) {
        return {};
    }
}

/**
 * Resolve author username by unique name using registry/all (best-effort).
 */
async function getAuthorUsernameByUniqueName(uniqueName: string): Promise<string | null> {
    try {
        const concepts = await getAllConcepts();
        const match = concepts.find((c) => c.uniqueName === uniqueName);
        const username = match?.authorUsername?.trim();
        return username ? username : null;
    } catch {
        return null;
    }
}

/**
 * Download a specific version via backend sync (records analytics).
 * Calls the download sync with required author_username; falls back to registry/files on failure.
 */
export async function downloadConceptVersion(
    uniqueName: string,
    version: number,
    accessToken?: string
): Promise<Record<string, string>> {
    // Try server download sync (records analytics). If it fails, fallback.
    try {
        const authorUsername = await getAuthorUsernameByUniqueName(uniqueName);
        const body: { unique_name: string; version: number; accessToken?: string; author_username?: string } = {
            unique_name: uniqueName,
            version,
        };
        if (accessToken) body.accessToken = accessToken;
        if (authorUsername) body.author_username = authorUsername;

        const response = await api.post<{ files: Record<string, string> }>(
            "/concepts/download/version",
            body,
            { timeout: 8000 }
        );
        const files = response.data?.files ?? {};
        if (files && Object.keys(files).length > 0) {
            return files;
        }
        // If empty, try fallback below
    } catch {
        // Ignore and try fallback
    }

    // Fallback: fetch files from registry (no analytics)
    try {
        const res = await api.post<RegistryFilesResponse>("/registry/files", {
            unique_name: uniqueName,
            version,
        });
        return res.data?.files ?? {};
    } catch {
        return {};
    }
}

/**
 * Fetch concept-level download count using DownloadAnalyzing._countForItem.
 * Resolves concept id by unique_name, then posts item + date range.
 */
export async function getConceptDownloadCountViaQuery(uniqueName: string): Promise<number> {
    const conceptId = await getConceptIdByUniqueName(uniqueName);
    if (!conceptId) return 0;
    try {
        const response = await api.post<Array<{ count: number }>>("/DownloadAnalyzing/_countForItem", {
            item: conceptId,
        });
        return response.data?.[0]?.count ?? 0;
    } catch {
        return 0;
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



/**
 * Get download count for a concept (aggregated across versions) via backend GET.
 */
// Removed GET count helper; rely on backend download sync to increment analytics.

/**
 * Get concept id by unique_name via registry/all
 */
export async function getConceptIdByUniqueName(uniqueName: string): Promise<string | null> {
    try {
        const response = await api.post<Array<{ id: string }>>('/ConceptRegistering/_lookup', { unique_name: uniqueName });
        return response.data?.[0]?.id ?? null;
    } catch {
        return null;
    }
}

/**
 * Get all versions for a concept given its unique name.
 * Returns sorted by createdAt desc.
 */
export interface ConceptRegisteringGetVersionsItem { version: number; createdAt: string; }
export async function getConceptVersions(uniqueName: string): Promise<ConceptRegisteringGetVersionsItem[]> {
    try {
        const conceptId = await getConceptIdByUniqueName(uniqueName);
        if (!conceptId) return [];
        const response = await api.post<{ versions: { version: number; createdAt: string }[] }[]>('/ConceptRegistering/_getVersions', { concept: conceptId });
        const arr = response.data[0]?.versions ?? [];
        return arr.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
        return [];
    }
}

/**
 * Publish a new version for an existing concept by unique name using folder upload.
 * Server enforces ownership via accessToken; returns version id string.
 */
export async function publishExistingConceptVersion(uniqueName: string, files: FileList | File[]): Promise<string> {
    // Reuse the same endpoint as concept creation; backend handles existing vs new flows
    return publishConceptWithFolder(uniqueName, files);
}

/**
 * README API helpers using backend endpoints.
 * - Generate: /readme/generate (Requesting path)
 * - Get: /ReadmeGenerating/get
 * - Update: /ReadmeGenerating/update
 */
export async function generateReadmeForConcept(uniqueName: string, overwrite = false, opts?: { files?: Record<string, string>; actions?: string[]; displayName?: string; accessToken?: string }): Promise<{ path: string; content?: string } | null> {
    try {
        const conceptId = await getConceptIdByUniqueName(uniqueName);
        if (!conceptId) return null;
        // Guard: avoid concurrent duplicate README generations for same concept
        if (readmeGenInFlight.has(conceptId)) {
            return null;
        }
        readmeGenInFlight.add(conceptId);
        const payload: any = {
            concept: conceptId,
            overwrite,
            displayName: opts?.displayName ?? uniqueName,
            files: opts?.files,
            actions: opts?.actions,
            accessToken: opts?.accessToken ?? (getAccessToken() || undefined),
            path: "/readme/generate",
        };
        // Use Requesting path to trigger GenerateReadmeFromButton sync
        await api.post<{ request: string }>("/readme/generate", payload);
        // Attempt to fetch the README content with a short retry/backoff to reduce empty first fetches
        let getRes: { data: any } | null = null;
        const attempts = 3;
        const delayMs = 300;
        for (let i = 0; i < attempts; i++) {
            try {
                getRes = await api.post<{ path: string; content?: string } | { error: string; path: string }>("/ReadmeGenerating/get", { concept: conceptId });
                if (getRes && getRes.data && !('error' in getRes.data)) break;
            } catch { }
            await new Promise(res => setTimeout(res, delayMs));
        }
        if (!getRes) return null;
        if ('error' in (getRes.data as any)) {
            return null;
        }
        return getRes.data as { path: string; content?: string };
    } catch {
        return null;
    } finally {
        // Ensure we clear the guard if conceptId was resolved
        try {
            const cid = await getConceptIdByUniqueName(uniqueName);
            if (cid) readmeGenInFlight.delete(cid);
        } catch { }
    }
}

export async function getReadmeForConcept(uniqueName: string): Promise<{ path: string; content?: string } | null> {
    try {
        const conceptId = await getConceptIdByUniqueName(uniqueName);
        if (!conceptId) return null;
        const res = await api.post<{ path: string; content?: string } | { error: string; path: string }>("/ReadmeGenerating/get", { concept: conceptId });
        if ('error' in (res.data as any)) return res.data as { path: string };
        return res.data as { path: string; content?: string };
    } catch {
        return null;
    }
}

// ConceptId-based variants for stricter backend expectations
export async function generateReadmeByConceptId(conceptId: string, overwrite = false, opts?: { files?: Record<string, string>; actions?: string[]; displayName?: string; accessToken?: string }): Promise<{ path: string; content?: string } | null> {
    try {
        // Guard: avoid concurrent duplicate README generations for same concept
        if (readmeGenInFlight.has(conceptId)) {
            return null;
        }
        readmeGenInFlight.add(conceptId);
        const payload: any = {
            concept: conceptId,
            overwrite,
            displayName: opts?.displayName,
            files: opts?.files,
            actions: opts?.actions,
            accessToken: opts?.accessToken ?? (getAccessToken() || undefined),
            path: "/readme/generate",
        };
        await api.post<{ request: string }>("/readme/generate", payload);
        // Short retry/backoff for get
        let getRes: { data: any } | null = null;
        const attempts = 3;
        const delayMs = 300;
        for (let i = 0; i < attempts; i++) {
            try {
                getRes = await api.post<{ path: string; content?: string } | { error: string; path: string }>("/ReadmeGenerating/get", { concept: conceptId });
                if (getRes && getRes.data && !('error' in getRes.data)) break;
            } catch { }
            await new Promise(res => setTimeout(res, delayMs));
        }
        if (!getRes) return null;
        if ('error' in (getRes.data as any)) return null;
        return getRes.data as { path: string; content?: string };
    } catch {
        return null;
    } finally {
        readmeGenInFlight.delete(conceptId);
    }
}

export async function getReadmeByConceptId(conceptId: string): Promise<{ path: string; content?: string } | null> {
    try {
        const res = await api.post<{ path: string; content?: string } | { error: string; path: string }>("/ReadmeGenerating/get", { concept: conceptId });
        if ('error' in (res.data as any)) return res.data as { path: string };
        return res.data as { path: string; content?: string };
    } catch {
        return null;
    }
}

export async function updateReadmeForConcept(uniqueName: string, content: string): Promise<{ path: string; content: string } | null> {
    try {
        const conceptId = await getConceptIdByUniqueName(uniqueName);
        if (!conceptId) return null;
        const res = await api.post<{ path: string; content: string }>("/ReadmeGenerating/update", { concept: conceptId, content });
        return res.data;
    } catch {
        return null;
    }
}
