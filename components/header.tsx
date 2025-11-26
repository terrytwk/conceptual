"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, LogOut, User } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated, userId, logout, isLoading } = useAuth()
  const navItems = [
    { name: "Concepts", href: "/concepts" },
    { name: "Features", href: "/features" },
    { name: "Docs", href: "/docs" },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search query:", searchQuery)
    // Add your search logic here
  }

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-foreground text-xl font-semibold">Conceptual</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[#888888] hover:text-foreground px-4 py-2 rounded-full font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center">
            <div className="flex items-center bg-muted border border-border rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-ring transition-all w-64">
              <Search className="h-5 w-5 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none flex-1"
              />
            </div>
          </form>
          {!isLoading && (
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Link href="/profile">
                  <button className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 border-2 border-primary/30 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                    <span className="text-sm font-semibold text-primary">
                      {userId ? userId.charAt(0).toUpperCase() : "?"}
                    </span>
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-foreground hover:text-foreground px-4 py-2 rounded-full font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-2 rounded-full font-medium shadow-sm">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-background border-t border-border text-foreground">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-semibold text-foreground">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[#888888] hover:text-foreground justify-start text-lg py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                {!isLoading && (
                  <div className="flex flex-col gap-3 mt-4">
                    {isAuthenticated ? (
                      <Link href="/profile" className="w-full">
                        <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border hover:bg-accent transition-colors">
                          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {userId ? userId.charAt(0).toUpperCase() : "?"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground truncate">
                              {userId || "User"}
                            </div>
                            <div className="text-xs text-muted-foreground">View Profile</div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <>
                        <Link href="/login" className="w-full">
                          <Button variant="ghost" className="w-full text-foreground hover:text-foreground px-4 py-2 rounded-full font-medium">
                            Login
                          </Button>
                        </Link>
                        <Link href="/signup" className="w-full">
                          <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-2 rounded-full font-medium shadow-sm">
                            Sign up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
