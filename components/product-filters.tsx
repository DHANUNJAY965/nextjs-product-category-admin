"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { categoryApi } from "@/lib/api"
import { localStorageApi } from "@/lib/local-storage"
import type { ProductFiltersType } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ProductFiltersProps {
  filters: ProductFiltersType
  onFiltersChange: (filters: ProductFiltersType) => void
  onClearFilters: () => void
  searchTerm: string
  onSearchChange: (search: string) => void
}

export function ProductFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  searchTerm,
  onSearchChange 
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<string[]>([])
  // Local state for pending filters (not applied until "Apply" is clicked)
  const [pendingFilters, setPendingFilters] = useState<ProductFiltersType>(filters)
  const [pendingSearchTerm, setPendingSearchTerm] = useState(searchTerm)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  // Update pending filters when props change (e.g., when filters are cleared)
  useEffect(() => {
    setPendingFilters(filters)
  }, [filters])

  useEffect(() => {
    setPendingSearchTerm(searchTerm)
  }, [searchTerm])

  const loadCategories = async () => {
    try {
      // Get API categories
      const apiCategories = await categoryApi.getAll()
      // Get local categories
      const localCategories = localStorageApi.getCategories()

      const apiCategoryNames = apiCategories.map((category: any) =>
        typeof category === "string" ? category : category.name,
      )

      // Combine both sources
      const allCategories = [...apiCategoryNames, ...localCategories.map((cat) => cat.name)]

      // Remove duplicates
      const uniqueCategories = Array.from(new Set(allCategories))
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error loading categories:", error)
      setCategories([]) // Set empty array on error to prevent crashes
    }
  }

  const handlePendingFilterChange = (key: keyof ProductFiltersType, value: any) => {
    setPendingFilters({
      ...pendingFilters,
      [key]: value === "all" ? undefined : value,
    })
  }

  const handleApplyFilters = () => {
    // Apply the pending filters and search term
    onFiltersChange(pendingFilters)
    onSearchChange(pendingSearchTerm)
    setShowMobileFilters(false)
  }

  const handleReset = () => {
    const resetFilters = {
      sortBy: "title",
      sortOrder: "asc",
    }
    setPendingFilters(resetFilters)
    setPendingSearchTerm("")
    onClearFilters()
    onSearchChange("")
    setShowMobileFilters(false)
  }

  // Count active filters for badge
  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm.trim()) count++
    if (filters.category) count++
    if (filters.minPrice !== undefined && filters.minPrice !== null) count++
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) count++
    if (filters.sortBy && filters.sortBy !== "title") count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <>
      {/* Desktop Layout */}
      <Card className="hidden lg:block border-0 sm:border shadow-sm mb-4 sm:mb-6">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col xl:flex-row gap-4 xl:gap-6">
            {/* Search Input */}
            <div className="relative xl:basis-[35%]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="h-11 xl:h-12 pl-10 text-sm xl:text-base"
                value={pendingSearchTerm}
                onChange={(e) => setPendingSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="xl:basis-1/5 ">
              <Select
                value={pendingFilters.category || "all"}
                onValueChange={(value) => handlePendingFilterChange("category", value)}
              >
                <SelectTrigger className="!h-12 cursor-pointer">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="cursor-pointer">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By Filter */}
            <div className="xl:basis-1/5">
              <Select 
                value={pendingFilters.sortBy || "title"} 
                onValueChange={(value) => handlePendingFilterChange("sortBy", value)}
              >
                <SelectTrigger className="!h-12 cursor-pointer">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title" className="cursor-pointer">Title</SelectItem>
                  <SelectItem value="price" className="cursor-pointer">Price</SelectItem>
                  <SelectItem value="category" className="cursor-pointer">Category</SelectItem>
                  <SelectItem value="rating" className="cursor-pointer">Rating</SelectItem>
                  
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 xl:basis-[20%]">
              <Button 
                type="button" 
                size="default" 
                className="flex-1 h-11 xl:h-12 text-sm xl:text-base cursor-pointer"
                onClick={handleApplyFilters}
              >
                Apply
              </Button>
              <Button
                type="button"
                size="default"
                variant="outline"
                className="flex-1 h-11 xl:h-12 text-sm xl:text-base cursor-pointer"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Layout */}
      <div className="lg:hidden mb-4 space-y-3">
        {/* Search Bar - Always visible */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="h-11 pl-10 pr-4 text-sm"
            value={pendingSearchTerm}
            onChange={(e) => setPendingSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Toggle Button & Active Filters */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 h-9"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </Button>

          {/* Quick Apply/Reset buttons */}
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={handleApplyFilters}
              className="h-9 px-4 text-xs"
            >
              Apply
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="h-9 px-3 text-xs"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchTerm.trim() && (
              <Badge variant="secondary" className="text-xs">
                Search: {searchTerm.slice(0, 20)}{searchTerm.length > 20 ? '...' : ''}
              </Badge>
            )}
            {filters.category && (
              <Badge variant="secondary" className="text-xs">
                Category: {filters.category}
              </Badge>
            )}
            {filters.sortBy && filters.sortBy !== "title" && (
              <Badge variant="secondary" className="text-xs">
                Sort: {filters.sortBy}
              </Badge>
            )}
            {filters.minPrice !== undefined && filters.minPrice !== null && (
              <Badge variant="secondary" className="text-xs">
                Min: ${filters.minPrice}
              </Badge>
            )}
            {filters.maxPrice !== undefined && filters.maxPrice !== null && (
              <Badge variant="secondary" className="text-xs">
                Max: ${filters.maxPrice}
              </Badge>
            )}
          </div>
        )}

        {/* Collapsible Filter Panel */}
        {showMobileFilters && (
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={pendingFilters.category || "all"}
                  onValueChange={(value) => handlePendingFilterChange("category", value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sort By</Label>
                <Select 
                  value={pendingFilters.sortBy || "title"} 
                  onValueChange={(value) => handlePendingFilterChange("sortBy", value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filters */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Min Price</Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    className="h-10"
                    value={pendingFilters.minPrice || ''}
                    onChange={(e) => handlePendingFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Max Price</Label>
                  <Input
                    type="number"
                    placeholder="$999"
                    className="h-10"
                    value={pendingFilters.maxPrice || ''}
                    onChange={(e) => handlePendingFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  size="sm" 
                  className="flex-1 h-10"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1 h-10"
                  onClick={handleReset}
                >
                  Reset All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tablet Layout */}
      <Card className="hidden sm:block lg:hidden border-0 sm:border shadow-sm mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Top Row: Search and Filter Toggle */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="h-11 pl-10 text-sm"
                  value={pendingSearchTerm}
                  onChange={(e) => setPendingSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="h-11 px-4 shrink-0"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Collapsible Filters */}
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Category</Label>
                    <Select
                      value={pendingFilters.category || "all"}
                      onValueChange={(value) => handlePendingFilterChange("category", value)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sort By</Label>
                    <Select 
                      value={pendingFilters.sortBy || "title"} 
                      onValueChange={(value) => handlePendingFilterChange("sortBy", value)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Min Price</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      className="h-10"
                      value={pendingFilters.minPrice || ''}
                      onChange={(e) => handlePendingFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Max Price</Label>
                    <Input
                      type="number"
                      placeholder="$999"
                      className="h-10"
                      value={pendingFilters.maxPrice || ''}
                      onChange={(e) => handlePendingFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    size="default" 
                    className="flex-1 h-10"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    type="button"
                    size="default"
                    variant="outline"
                    className="flex-1 h-10"
                    onClick={handleReset}
                  >
                    Reset All
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && !isFiltersOpen && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {searchTerm.trim() && (
                  <Badge variant="secondary" className="text-xs">
                    Search: {searchTerm.slice(0, 30)}{searchTerm.length > 30 ? '...' : ''}
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary" className="text-xs">
                    Category: {filters.category}
                  </Badge>
                )}
                {filters.sortBy && filters.sortBy !== "title" && (
                  <Badge variant="secondary" className="text-xs">
                    Sort: {filters.sortBy}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}