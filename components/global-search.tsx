"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Package, Tag, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { productApi } from "@/lib/api"
import { localStorageApi } from "@/lib/local-storage"
import type { Product } from "@/types"

interface SearchResult {
  type: "product" | "category"
  id: string | number
  title: string
  description?: string
  category?: string
  price?: number
}

export function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch(query.trim())
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    try {
      setIsLoading(true)
      const searchResults: SearchResult[] = []

      // Search products
      try {
        const productResponse = await productApi.search(searchQuery)
        const productResults: SearchResult[] = (productResponse.products || []).slice(0, 5).map((product: Product) => ({
          type: "product" as const,
          id: product.id,
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
        }))
        searchResults.push(...productResults)
      } catch (error) {
        console.error("Error searching products:", error)
      }

      // Search categories
      const categories = localStorageApi.getCategories()
      const categoryResults: SearchResult[] = categories
        .filter(
          (category) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 3)
        .map((category) => ({
          type: "category" as const,
          id: category.id,
          title: category.name,
          description: category.description,
        }))
      searchResults.push(...categoryResults)

      setResults(searchResults)
      setIsOpen(searchResults.length > 0)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "product") {
      router.push("/products")
    } else {
      router.push("/categories")
    }
    setIsOpen(false)
    setQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length > 2 && results.length > 0 && setIsOpen(true)}
          className="pl-8 pr-10"
        />
        {isLoading && (
          <div className="absolute right-2.5 top-2.5">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full p-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {result.type === "product" ? (
                        <Package className="h-4 w-4 text-primary" />
                      ) : (
                        <Tag className="h-4 w-4 text-secondary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-sm truncate">{result.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {result.type}
                        </Badge>
                      </div>
                      {result.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{result.description}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        {result.category && (
                          <Badge variant="secondary" className="text-xs">
                            {result.category}
                          </Badge>
                        )}
                        {result.price && <span className="text-xs font-medium text-primary">${result.price}</span>}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
