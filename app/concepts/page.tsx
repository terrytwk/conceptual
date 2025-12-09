'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { FooterSection } from '@/components/footer-section'
import { ConceptsSidebar } from '@/components/concepts/sidebar'
import { ConceptsGrid } from '@/components/concepts/grid'
import { ConceptsPromo } from '@/components/concepts/promo'
import { AddConceptDialog } from '@/components/concepts/add-concept-dialog'
import { Search, ChevronDown, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

export default function ConceptsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortBy, setSortBy] = useState<'likes_desc' | 'likes_asc' | 'downloads_desc' | 'downloads_asc' | 'date_desc' | 'date_asc'>('date_desc')
    const [sortOpen, setSortOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const { isAuthenticated } = useAuth()

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Title and Controls */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Concepts</h1>
                            <p className="text-muted-foreground">Explore backend components ready to use</p>
                        </div>
                        {isAuthenticated && (
                            <Button
                                onClick={() => setIsAddDialogOpen(true)}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Concept
                            </Button>
                        )}
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Filter by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="relative">
                                                                <button onClick={() => setSortOpen((o)=>!o)} className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-card text-foreground rounded-md hover:bg-muted/80 transition-colors border border-border">
                                                                        <span>Sort: {sortBy === 'likes_desc' ? 'Most likes' : sortBy === 'likes_asc' ? 'Least likes' : sortBy === 'downloads_desc' ? 'Most downloads' : sortBy === 'downloads_asc' ? 'Least downloads' : sortBy === 'date_desc' ? 'Newest' : 'Oldest'}</span>
                                                                        <ChevronDown className="w-4 h-4" />
                                                                </button>
                                                                                                {sortOpen && (
                                                                                                    <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-background shadow-md z-50">
                                                                        <button onClick={() => { setSortBy('likes_desc'); setSortOpen(false); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-muted/60">Most likes</button>
                                                                        <button onClick={() => { setSortBy('likes_asc'); setSortOpen(false); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-muted/60">Least likes</button>
                                                                        <button onClick={() => { setSortBy('downloads_desc'); setSortOpen(false); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-muted/60">Most downloads</button>
                                                                        <button onClick={() => { setSortBy('downloads_asc'); setSortOpen(false); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-muted/60">Least downloads</button>
                                                                        <button onClick={() => { setSortBy('date_desc'); setSortOpen(false); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-muted/60">Newest</button>
                                                                        <button onClick={() => { setSortBy('date_asc'); setSortOpen(false); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-muted/60">Oldest</button>
                                                                    </div>
                                                                )}
                                                        </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <ConceptsSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                    </div>

                    {/* Grid Content */}
                    <div className="lg:col-span-2">
                        <ConceptsGrid
                            searchQuery={searchQuery}
                            selectedCategory={selectedCategory}
                            refreshKey={refreshKey}
                            sortBy={sortBy}
                        />
                    </div>

                    {/* Promo Sidebar */}
                    <div className="lg:col-span-1">
                        <ConceptsPromo />
                    </div>
                </div>
            </main>
            <div className="mt-16">
                <FooterSection />
            </div>

            <AddConceptDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={() => {
                    // Refresh the concepts list
                    setRefreshKey(prev => prev + 1)
                }}
            />
        </div>
    )
}
