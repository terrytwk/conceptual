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
    const [sortBy, setSortBy] = useState('trending')
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
                            <button className="px-3 py-2 text-sm font-medium bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors">
                                Full-text search
                            </button>
                            <div className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-primary/10 text-primary rounded-md cursor-pointer hover:bg-primary/15 transition-colors">
                                <span>⭐</span>
                                <span>Most liked</span>
                            </div>
                            <div className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-muted text-foreground rounded-md cursor-pointer hover:bg-muted/80 transition-colors">
                                <span>Sort: Trending</span>
                                <ChevronDown className="w-4 h-4" />
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
