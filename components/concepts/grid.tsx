'use client'

import { useState, useEffect } from 'react'
import { Box, ThumbsUp, Download, Zap, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getAllConcepts, type ConceptItem, getConceptDownloadCountViaQuery } from '@/lib/concepts'
import { countForItem, isLiked, like as likeApi, unlike as unlikeApi } from '@/lib/liking'
import { useAuth } from '@/contexts/auth-context'
import JSZip from 'jszip'
import { getConceptFiles } from '@/lib/concepts'

interface ConceptsGridProps {
    searchQuery: string
    selectedCategory: string
    refreshKey?: number
}

interface Concept {
    id: string
    title: string
    description: string
    category: string
    tags: string[]
    likes: number
    views: number
    updated: Date
    featured: boolean
    owner?: string
    latestVersion?: string
    versionCount?: number
    latestArtifactUrl?: string
}

// Dummy concepts data - commented out but kept for reference
// const dummyConcepts = [
//     {
//         id: 1,
//         title: 'User',
//         description: 'Associate identifying information with users. Handles registration and user data updates.',
//         category: 'user-management',
//         tags: ['authentication', 'identity'],
//         likes: 1240,
//         views: 45600,
//         updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
//         featured: true,
//     },
//     {
//         id: 2,
//         title: 'Post',
//         description: 'User-facing unit for creating and managing content in social media applications',
//         category: 'social',
//         tags: ['content', 'social'],
//         likes: 892,
//         views: 32100,
//         updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
//         featured: true,
//     },
//     {
//         id: 3,
//         title: 'Comment',
//         description: 'Allows users to associate comments with any target object. Fully polymorphic and independent.',
//         category: 'social',
//         tags: ['interaction', 'social'],
//         likes: 567,
//         views: 18900,
//         updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
//         featured: false,
//     },
//     {
//         id: 4,
//         title: 'Upvote',
//         description: 'Express positive feedback on posts, comments, or any target content',
//         category: 'interaction',
//         tags: ['engagement', 'social'],
//         likes: 723,
//         views: 25400,
//         updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//         featured: false,
//     },
//     {
//         id: 5,
//         title: 'Friend',
//         description: 'Manage social connections and follow relationships between users',
//         category: 'social',
//         tags: ['relationships', 'social'],
//         likes: 645,
//         views: 21700,
//         updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//         featured: false,
//     },
//     {
//         id: 6,
//         title: 'Profile',
//         description: 'Associate descriptive information with users, including bio and profile images',
//         category: 'user-management',
//         tags: ['identity', 'profile'],
//         likes: 891,
//         views: 33200,
//         updated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
//         featured: false,
//     },
//     {
//         id: 7,
//         title: 'Article',
//         description: 'Publish and manage articles with title, description, body, and metadata',
//         category: 'content',
//         tags: ['content', 'publishing'],
//         likes: 754,
//         views: 28900,
//         updated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
//         featured: false,
//     },
//     {
//         id: 8,
//         title: 'Tag',
//         description: 'Categorize and organize content with flexible tagging system',
//         category: 'content',
//         tags: ['organization', 'metadata'],
//         likes: 623,
//         views: 20100,
//         updated: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
//         featured: false,
//     },
//     {
//         id: 9,
//         title: 'Favorite',
//         description: 'Bookmark and track favorite content with count tracking',
//         category: 'interaction',
//         tags: ['bookmarking', 'engagement'],
//         likes: 589,
//         views: 19200,
//         updated: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
//         featured: false,
//     },
//     {
//         id: 10,
//         title: 'Password',
//         description: 'Secure authentication and password management for user accounts',
//         category: 'user-management',
//         tags: ['security', 'authentication'],
//         likes: 856,
//         views: 27800,
//         updated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
//         featured: false,
//     },
// ]

// Helper function to generate dummy data for fields that don't exist in API yet
function generateDummyData(conceptId: string, title: string): Omit<Concept, 'id' | 'title' | 'owner' | 'latestVersion' | 'versionCount'> {
    // Generate consistent dummy data based on concept ID
    const categories = ['user-management', 'social', 'content', 'interaction']
    const allTags = ['authentication', 'identity', 'content', 'social', 'interaction', 'engagement', 'relationships', 'profile', 'publishing', 'organization', 'metadata', 'bookmarking', 'security']

    // Use concept ID to generate consistent dummy values
    const hash = conceptId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    return {
        description: `A reusable backend concept for ${title.toLowerCase()} functionality.`,
        category: categories[hash % categories.length],
        tags: allTags.slice(hash % allTags.length, (hash % allTags.length) + 2),
        likes: (hash % 1000) + 100,
        views: ((hash % 50) + 10) * 1000,
        updated: new Date(Date.now() - (hash % 30) * 24 * 60 * 60 * 1000),
        featured: hash % 3 === 0,
    }
}

// Convert API concept item to display concept
function convertApiConceptToDisplay(apiConcept: ConceptItem): Concept {
    // Get the latest published version
    const publishedVersions = apiConcept.versions.filter(v => v.status === 'PUBLISHED')
    const latestPublished = publishedVersions.length > 0
        ? publishedVersions.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0]
        : null
    // Fallback: use most recent version (any status) with an artifactUrl when no published versions exist
    const mostRecentAny = apiConcept.versions.length > 0
        ? [...apiConcept.versions].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0]
        : null
    const latestVersion = latestPublished ?? mostRecentAny

    // Get the most recent published date, or use current date if no versions
    const updatedDate = latestVersion
        ? new Date(latestVersion.publishedAt)
        : new Date()

    // Generate dummy data for fields not in API
    const dummyData = generateDummyData(apiConcept.concept, apiConcept.uniqueName)

    // Format title as {author_username}/{unique_name}
    const displayTitle = apiConcept.authorUsername
        ? `${apiConcept.authorUsername}/${apiConcept.uniqueName}`
        : apiConcept.uniqueName;

    return {
        id: apiConcept.concept,
        title: displayTitle,
        owner: apiConcept.owner,
    latestVersion: latestVersion?.semver,
    latestArtifactUrl: latestVersion?.artifactUrl,
        versionCount: apiConcept.versions.length,
        ...dummyData,
        updated: updatedDate, // Override dummy updated with real published date
    }
}

export function ConceptsGrid({ searchQuery, selectedCategory, refreshKey }: ConceptsGridProps) {
    const [concepts, setConcepts] = useState<Concept[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [likesMap, setLikesMap] = useState<Record<string, number>>({})
    const [downloadsMap, setDownloadsMap] = useState<Record<string, number | null>>({})
    const [likedMap, setLikedMap] = useState<Record<string, boolean>>({})
    const { userId, isAuthenticated } = useAuth()

    useEffect(() => {
        async function fetchConcepts() {
            setIsLoading(true)
            setError(null)
            try {
                const apiConcepts = await getAllConcepts()
                const displayConcepts = apiConcepts.map(convertApiConceptToDisplay)

                // Fetch like counts in parallel
                const counts = await Promise.all(displayConcepts.map(c => countForItem(c.id)))
                const lm: Record<string, number> = {}
                displayConcepts.forEach((c, i) => { lm[c.id] = counts[i] })
                setLikesMap(lm)

                // Fetch liked state if authenticated
                const likedState: Record<string, boolean> = {}
                if (isAuthenticated && userId) {
                    const likedFlags = await Promise.all(displayConcepts.map(c => isLiked(c.id, userId)))
                    displayConcepts.forEach((c, i) => { likedState[c.id] = likedFlags[i] })
                }
                setLikedMap(likedState)

                setConcepts(displayConcepts)

                // Fetch download counts per concept (by uniqueName)
                const downloadCounts = await Promise.all(
                    displayConcepts.map(async (c) => {
                        const uniqueName = c.title.includes('/') ? c.title.split('/').pop()! : c.title
                        try {
                            const count = await getConceptDownloadCountViaQuery(uniqueName)
                            return { id: c.id, count }
                        } catch {
                            return { id: c.id, count: 0 }
                        }
                    })
                )
                const dm: Record<string, number | null> = {}
                for (const { id, count } of downloadCounts) dm[id] = count
                setDownloadsMap(dm)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load concepts')
                console.error('Error fetching concepts:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchConcepts()
    }, [refreshKey, isAuthenticated, userId])

    const filteredConcepts = concepts.filter((concept) => {
        const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            concept.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || concept.category === selectedCategory || (selectedCategory === 'liked' && likedMap[concept.id] === true)
        return matchesSearch && matchesCategory
    })

    const downloadConcept = async (concept: Concept) => {
        try {
            const uniqueName = concept.title.includes('/') ? concept.title.split('/').pop()! : concept.title
            const files = await getConceptFiles(uniqueName)
            const fileEntries = Object.entries(files)
            if (fileEntries.length === 0) {
                alert('No files found to download for this concept.')
                return
            }
            const zip = new JSZip()
            for (const [path, content] of fileEntries) {
                zip.file(path, content)
            }
            const blob = await zip.generateAsync({ type: 'blob' })
            const objectUrl = URL.createObjectURL(blob)
            const filename = `${uniqueName}-${concept.latestVersion ?? 'latest'}.zip`
            const a = document.createElement('a')
            a.href = objectUrl
            a.download = filename
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(objectUrl)
        } catch (e) {
            console.error(e)
            alert('Download failed. Please try again later.')
        }
    }

    const toggleLike = async (conceptId: string) => {
        if (!isAuthenticated || !userId) return
        const liked = likedMap[conceptId] === true
        if (liked) {
            const res = await unlikeApi(conceptId, userId)
            if (!res.error) {
                setLikedMap(prev => ({ ...prev, [conceptId]: false }))
                setLikesMap(prev => ({ ...prev, [conceptId]: Math.max(0, (prev[conceptId] ?? 0) - 1) }))
            }
        } else {
            const res = await likeApi(conceptId, userId)
            if (!res.error) {
                setLikedMap(prev => ({ ...prev, [conceptId]: true }))
                setLikesMap(prev => ({ ...prev, [conceptId]: (prev[conceptId] ?? 0) + 1 }))
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading concepts...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-sm text-destructive mb-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-sm text-primary hover:underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
                {filteredConcepts.length} {filteredConcepts.length === 1 ? 'concept' : 'concepts'} found
            </div>

            {filteredConcepts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        {searchQuery || selectedCategory !== 'all'
                            ? 'No concepts match your filters.'
                            : 'No concepts registered yet. Be the first to add one!'}
                    </p>
                </div>
            ) : (
        <div className="space-y-3">
                    {filteredConcepts.map((concept) => {
                        // concept.title formatted as author/uniqueName or uniqueName; extract uniqueName (after last '/')
                        const uniqueName = concept.title.includes('/') ? concept.title.split('/').pop()! : concept.title;
                        return (
            <div
                            key={concept.id}
                            className="group block p-4 rounded-lg border border-border hover:border-primary/50 bg-card hover:bg-card/80 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="mt-1">
                                        <Box className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <a href={`/concepts/${uniqueName}`} className="font-semibold text-foreground group-hover:text-primary transition-colors hover:underline">
                                            {concept.title}
                                        </a>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {concept.description}
                                        </p>
                                    </div>
                                </div>
                                {concept.featured && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium ml-2 shrink-0">
                                        <Zap className="w-3 h-3" />
                                        Featured
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3 mb-3">
                                {concept.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Updated {formatDistanceToNow(concept.updated, { addSuffix: true })}</span>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        disabled
                                        className="flex items-center gap-1 text-muted-foreground"
                                    >
                                        <Download className="w-3 h-3" />
                                        <span>{downloadsMap[concept.id] == null ? '~' : downloadsMap[concept.id]}</span>
                                    </button>
                                    <button
                                        onClick={() => toggleLike(concept.id)}
                                        disabled={!isAuthenticated}
                                        className={`flex items-center gap-1 ${likedMap[concept.id] ? 'text-primary' : ''}`}
                                    >
                                        <ThumbsUp className="w-3 h-3" />
                                        <span>{(likesMap[concept.id] ?? 0)}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            )}
        </div>
    )
}
