// // "use client"

// // import { useState, useEffect } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Label } from "@/components/ui/label"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Slider } from "@/components/ui/slider"
// // import { Filter, X, RotateCcw } from "lucide-react"
// // import { categoryApi } from "@/lib/api"
// // import { localStorageApi } from "@/lib/local-storage"
// // import type { ProductFiltersType } from "@/types"

// // interface ProductFiltersProps {
// //   filters: ProductFiltersType
// //   onFiltersChange: (filters: ProductFiltersType) => void
// //   onClearFilters: () => void
// // }

// // export function ProductFilters({ filters, onFiltersChange, onClearFilters }: ProductFiltersProps) {
// //   const [categories, setCategories] = useState<string[]>([])
// //   const [isExpanded, setIsExpanded] = useState(false)
// //   const [priceRange, setPriceRange] = useState<[number, number]>([filters.minPrice || 0, filters.maxPrice || 1000])

// //   useEffect(() => {
// //     loadCategories()
// //   }, [])

// //   useEffect(() => {
// //     setPriceRange([filters.minPrice || 0, filters.maxPrice || 1000])
// //   }, [filters.minPrice, filters.maxPrice])

// //   const loadCategories = async () => {
// //     try {
// //       // Get API categories
// //       const apiCategories = await categoryApi.getAll()
// //       // Get local categories
// //       const localCategories = localStorageApi.getCategories()

// //       const apiCategoryNames = apiCategories.map((category: any) =>
// //         typeof category === "string" ? category : category.name,
// //       )

// //       // Combine both sources
// //       const allCategories = [...apiCategoryNames, ...localCategories.map((cat) => cat.name)]

// //       // Remove duplicates
// //       const uniqueCategories = Array.from(new Set(allCategories))
// //       setCategories(uniqueCategories)
// //     } catch (error) {
// //       console.error("Error loading categories:", error)
// //       setCategories([]) // Set empty array on error to prevent crashes
// //     }
// //   }

// //   const handleFilterChange = (key: keyof ProductFiltersType, value: any) => {
// //     onFiltersChange({
// //       ...filters,
// //       [key]: value,
// //     })
// //   }

// //   const handlePriceRangeChange = (values: number[]) => {
// //     setPriceRange([values[0], values[1]])
// //     onFiltersChange({
// //       ...filters,
// //       minPrice: values[0],
// //       maxPrice: values[1],
// //     })
// //   }

// //   const getActiveFiltersCount = () => {
// //     let count = 0
// //     if (filters.category) count++
// //     if (filters.minPrice && filters.minPrice > 0) count++
// //     if (filters.maxPrice && filters.maxPrice < 1000) count++
// //     if (filters.sortBy && filters.sortBy !== "title") count++
// //     if (filters.sortOrder && filters.sortOrder !== "asc") count++
// //     return count
// //   }

// //   const activeFiltersCount = getActiveFiltersCount()

// //   return (
// //     <Card>
// //       <CardHeader className="pb-3">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center space-x-2">
// //             <CardTitle className="text-lg flex items-center">
// //               <Filter className="mr-2 h-4 w-4" />
// //               Filters
// //             </CardTitle>
// //             {activeFiltersCount > 0 && (
// //               <Badge variant="secondary" className="text-xs">
// //                 {activeFiltersCount}
// //               </Badge>
// //             )}
// //           </div>
// //           <div className="flex items-center space-x-2">
// //             {activeFiltersCount > 0 && (
// //               <Button variant="ghost" size="sm" onClick={onClearFilters}>
// //                 <RotateCcw className="mr-1 h-3 w-3" />
// //                 Clear
// //               </Button>
// //             )}
// //             <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
// //               {isExpanded ? "Collapse" : "Expand"}
// //             </Button>
// //           </div>
// //         </div>
// //         <CardDescription>Filter and sort products to find what you're looking for</CardDescription>
// //       </CardHeader>

// //       {isExpanded && (
// //         <CardContent className="space-y-6">
// //           {/* Category Filter */}
// //           <div className="space-y-2">
// //             <Label>Category</Label>
// //             <Select
// //               value={filters.category || "all"}
// //               onValueChange={(value) => handleFilterChange("category", value || undefined)}
// //             >
// //               <SelectTrigger>
// //                 <SelectValue placeholder="All categories" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="all">All categories</SelectItem>
// //                 {categories.map((category) => (
// //                   <SelectItem key={category} value={category}>
// //                     {category}
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>
// //           </div>

// //           {/* Price Range */}
// //           <div className="space-y-3">
// //             <Label>Price Range</Label>
// //             <div className="px-2">
// //               <Slider
// //                 value={priceRange}
// //                 onValueChange={handlePriceRangeChange}
// //                 max={1000}
// //                 min={0}
// //                 step={10}
// //                 className="w-full"
// //               />
// //             </div>
// //             <div className="flex items-center justify-between text-sm text-muted-foreground">
// //               <span>${priceRange[0]}</span>
// //               <span>${priceRange[1]}</span>
// //             </div>
// //           </div>

// //           {/* Sort Options */}
// //           <div className="grid grid-cols-2 gap-4">
// //             <div className="space-y-2">
// //               <Label>Sort By</Label>
// //               <Select value={filters.sortBy || "title"} onValueChange={(value) => handleFilterChange("sortBy", value)}>
// //                 <SelectTrigger>
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="title">Title</SelectItem>
// //                   <SelectItem value="price">Price</SelectItem>
// //                   <SelectItem value="category">Category</SelectItem>
// //                   <SelectItem value="rating">Rating</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>

// //             <div className="space-y-2">
// //               <Label>Order</Label>
// //               <Select
// //                 value={filters.sortOrder || "asc"}
// //                 onValueChange={(value: "asc" | "desc") => handleFilterChange("sortOrder", value)}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="asc">Ascending</SelectItem>
// //                   <SelectItem value="desc">Descending</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //           </div>

// //           {/* Active Filters */}
// //           {activeFiltersCount > 0 && (
// //             <div className="space-y-2">
// //               <Label>Active Filters</Label>
// //               <div className="flex flex-wrap gap-2">
// //                 {filters.category && (
// //                   <Badge variant="secondary" className="text-xs">
// //                     Category: {filters.category}
// //                     <Button
// //                       variant="ghost"
// //                       size="sm"
// //                       className="ml-1 h-auto p-0 text-xs"
// //                       onClick={() => handleFilterChange("category", undefined)}
// //                     >
// //                       <X className="h-3 w-3" />
// //                     </Button>
// //                   </Badge>
// //                 )}
// //                 {(filters.minPrice && filters.minPrice > 0) || (filters.maxPrice && filters.maxPrice < 1000) ? (
// //                   <Badge variant="secondary" className="text-xs">
// //                     Price: ${filters.minPrice || 0} - ${filters.maxPrice || 1000}
// //                     <Button
// //                       variant="ghost"
// //                       size="sm"
// //                       className="ml-1 h-auto p-0 text-xs"
// //                       onClick={() => {
// //                         handleFilterChange("minPrice", undefined)
// //                         handleFilterChange("maxPrice", undefined)
// //                       }}
// //                     >
// //                       <X className="h-3 w-3" />
// //                     </Button>
// //                   </Badge>
// //                 ) : null}
// //                 {filters.sortBy && filters.sortBy !== "title" && (
// //                   <Badge variant="secondary" className="text-xs">
// //                     Sort: {filters.sortBy} ({filters.sortOrder})
// //                     <Button
// //                       variant="ghost"
// //                       size="sm"
// //                       className="ml-1 h-auto p-0 text-xs"
// //                       onClick={() => {
// //                         handleFilterChange("sortBy", "title")
// //                         handleFilterChange("sortOrder", "asc")
// //                       }}
// //                     >
// //                       <X className="h-3 w-3" />
// //                     </Button>
// //                   </Badge>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </CardContent>
// //       )}
// //     </Card>
// //   )
// // }
// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Search } from "lucide-react"
// import { categoryApi } from "@/lib/api"
// import { localStorageApi } from "@/lib/local-storage"
// import type { ProductFiltersType } from "@/types"

// interface ProductFiltersProps {
//   filters: ProductFiltersType
//   onFiltersChange: (filters: ProductFiltersType) => void
//   onClearFilters: () => void
//   searchTerm: string
//   onSearchChange: (search: string) => void
// }

// export function ProductFilters({ 
//   filters, 
//   onFiltersChange, 
//   onClearFilters,
//   searchTerm,
//   onSearchChange 
// }: ProductFiltersProps) {
//   const [categories, setCategories] = useState<string[]>([])
//   // Local state for pending filters (not applied until "Apply" is clicked)
//   const [pendingFilters, setPendingFilters] = useState<ProductFiltersType>(filters)
//   const [pendingSearchTerm, setPendingSearchTerm] = useState(searchTerm)

//   useEffect(() => {
//     loadCategories()
//   }, [])

//   // Update pending filters when props change (e.g., when filters are cleared)
//   useEffect(() => {
//     setPendingFilters(filters)
//   }, [filters])

//   useEffect(() => {
//     setPendingSearchTerm(searchTerm)
//   }, [searchTerm])

//   const loadCategories = async () => {
//     try {
//       // Get API categories
//       const apiCategories = await categoryApi.getAll()
//       // Get local categories
//       const localCategories = localStorageApi.getCategories()

//       const apiCategoryNames = apiCategories.map((category: any) =>
//         typeof category === "string" ? category : category.name,
//       )

//       // Combine both sources
//       const allCategories = [...apiCategoryNames, ...localCategories.map((cat) => cat.name)]

//       // Remove duplicates
//       const uniqueCategories = Array.from(new Set(allCategories))
//       setCategories(uniqueCategories)
//     } catch (error) {
//       console.error("Error loading categories:", error)
//       setCategories([]) // Set empty array on error to prevent crashes
//     }
//   }

//   const handlePendingFilterChange = (key: keyof ProductFiltersType, value: any) => {
//     setPendingFilters({
//       ...pendingFilters,
//       [key]: value === "all" ? undefined : value,
//     })
//   }

//   const handleApplyFilters = () => {
//     // Apply the pending filters and search term
//     onFiltersChange(pendingFilters)
//     onSearchChange(pendingSearchTerm)
//   }

//   const handleReset = () => {
//     const resetFilters = {
//       sortBy: "title",
//       sortOrder: "asc",
//     }
//     setPendingFilters(resetFilters)
//     setPendingSearchTerm("")
//     onClearFilters()
//     onSearchChange("")
//   }

//   return (
//     <Card className="mb-5">
//       <CardContent className="p-4">
//         <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
//           {/* Search Input */}
//           <div className="relative md:basis-[30%]">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search products..."
//               className="h-12 pl-10"
//               value={pendingSearchTerm}
//               onChange={(e) => setPendingSearchTerm(e.target.value)}
//             />
//           </div>

//           {/* Category Filter */}
//           <div className="md:basis-1/5">
//             <Select
//               value={pendingFilters.category || "all"}
//               onValueChange={(value) => handlePendingFilterChange("category", value)}
//             >
//               <SelectTrigger className="h-12">
//                 <SelectValue placeholder="All Categories" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Categories</SelectItem>
//                 {categories.map((category) => (
//                   <SelectItem key={category} value={category}>
//                     {category}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Sort By Filter */}
//           <div className="md:basis-1/5">
//             <Select 
//               value={pendingFilters.sortBy || "title"} 
//               onValueChange={(value) => handlePendingFilterChange("sortBy", value)}
//             >
//               <SelectTrigger className="h-12">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="title">Title</SelectItem>
//                 <SelectItem value="price">Price</SelectItem>
//                 <SelectItem value="category">Category</SelectItem>
//                 <SelectItem value="rating">Rating</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-[30%]">
//             <Button 
//               type="button" 
//               size="lg" 
//               className="flex-grow h-12"
//               onClick={handleApplyFilters}
//             >
//               Apply
//             </Button>
//             <Button
//               type="button"
//               size="lg"
//               variant="secondary"
//               className="flex-grow h-12"
//               onClick={handleReset}
//             >
//               Reset
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { categoryApi } from "@/lib/api"
import { localStorageApi } from "@/lib/local-storage"
import type { ProductFiltersType } from "@/types"

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
  }

  return (
    <Card className="mb-5">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          {/* Search Input */}
          <div className="relative md:basis-[30%]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="h-12 pl-10"
              value={pendingSearchTerm}
              onChange={(e) => setPendingSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="md:basis-1/5">
            <Select
              value={pendingFilters.category || "all"}
              onValueChange={(value) => handlePendingFilterChange("category", value)}
            >
              <SelectTrigger className="!h-12">
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
          <div className="md:basis-1/5">
            <Select 
              value={pendingFilters.sortBy || "title"} 
              onValueChange={(value) => handlePendingFilterChange("sortBy", value)}
            >
              <SelectTrigger className="!h-12">
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

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-[30%]">
            <Button 
              type="button" 
              size="lg" 
              className="flex-grow h-12"
              onClick={handleApplyFilters}
            >
              Apply
            </Button>
            <Button
              type="button"
              size="lg"
              variant="secondary"
              className="flex-grow h-12"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}