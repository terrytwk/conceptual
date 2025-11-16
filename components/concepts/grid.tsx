'use client'

import { Box, ThumbsUp, Download, Zap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ConceptsGridProps {
    searchQuery: string
    selectedCategory: string
}

const concepts = [
    {
        id: 1,
        title: 'User',
        description: 'Associate identifying information with users. Handles registration and user data updates.',
        category: 'user-management',
        tags: ['authentication', 'identity'],
        likes: 1240,
        views: 45600,
        updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        featured: true,
    },
    {
        id: 2,
        title: 'Post',
        description: 'User-facing unit for creating and managing content in social media applications',
        category: 'social',
        tags: ['content', 'social'],
        likes: 892,
        views: 32100,
        updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        featured: true,
    },
    {
        id: 3,
        title: 'Comment',
        description: 'Allows users to associate comments with any target object. Fully polymorphic and independent.',
        category: 'social',
        tags: ['interaction', 'social'],
        likes: 567,
        views: 18900,
        updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        featured: false,
    },
    {
        id: 4,
        title: 'Upvote',
        description: 'Express positive feedback on posts, comments, or any target content',
        category: 'interaction',
        tags: ['engagement', 'social'],
        likes: 723,
        views: 25400,
        updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        featured: false,
    },
    {
        id: 5,
        title: 'Friend',
        description: 'Manage social connections and follow relationships between users',
        category: 'social',
        tags: ['relationships', 'social'],
        likes: 645,
        views: 21700,
        updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        featured: false,
    },
    {
        id: 6,
        title: 'Profile',
        description: 'Associate descriptive information with users, including bio and profile images',
        category: 'user-management',
        tags: ['identity', 'profile'],
        likes: 891,
        views: 33200,
        updated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        featured: false,
    },
    {
        id: 7,
        title: 'Article',
        description: 'Publish and manage articles with title, description, body, and metadata',
        category: 'content',
        tags: ['content', 'publishing'],
        likes: 754,
        views: 28900,
        updated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        featured: false,
    },
    {
        id: 8,
        title: 'Tag',
        description: 'Categorize and organize content with flexible tagging system',
        category: 'content',
        tags: ['organization', 'metadata'],
        likes: 623,
        views: 20100,
        updated: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        featured: false,
    },
    {
        id: 9,
        title: 'Favorite',
        description: 'Bookmark and track favorite content with count tracking',
        category: 'interaction',
        tags: ['bookmarking', 'engagement'],
        likes: 589,
        views: 19200,
        updated: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        featured: false,
    },
    {
        id: 10,
        title: 'Password',
        description: 'Secure authentication and password management for user accounts',
        category: 'user-management',
        tags: ['security', 'authentication'],
        likes: 856,
        views: 27800,
        updated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        featured: false,
    },
]

export function ConceptsGrid({ searchQuery, selectedCategory }: ConceptsGridProps) {
    const filteredConcepts = concepts.filter((concept) => {
        const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            concept.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || concept.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
                {filteredConcepts.length} concepts found
            </div>

            <div className="space-y-3">
                {filteredConcepts.map((concept) => (
                    <a
                        key={concept.id}
                        href={`#concept-${concept.id}`}
                        className="group block p-4 rounded-lg border border-border hover:border-primary/50 bg-card hover:bg-card/80 transition-all cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="mt-1">
                                    <Box className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {concept.title}
                                    </h3>
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
                                <div className="flex items-center gap-1">
                                    <Download className="w-3 h-3" />
                                    <span>{(concept.views / 1000).toFixed(0)}k</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3" />
                                    <span>{concept.likes}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}
