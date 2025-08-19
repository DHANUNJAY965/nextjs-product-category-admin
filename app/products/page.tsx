"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package, Eye, Star, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { ProductDialog } from "@/components/product-dialog"
import { DeleteProductDialog } from "@/components/delete-product-dialog"
import { ProductViewDialog } from "@/components/product-view-dialog"
import { ProductFilters } from "@/components/product-filters"
import { EmptyState } from "@/components/empty-state"
import { ProductTableSkeleton } from "@/components/loading-skeleton"
import { productApi } from "@/lib/api"
import type { Product, ProductFilters as ProductFiltersType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Extended Product type to track local products
interface ExtendedProduct extends Product {
  isLocal?: boolean // Track if product was added locally
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ExtendedProduct[]>([])
  const [allProducts, setAllProducts] = useState<ExtendedProduct[]>([])
  const [localProducts, setLocalProducts] = useState<ExtendedProduct[]>([]) // Store locally added products
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [nextLocalId, setNextLocalId] = useState(1000) // Start local IDs from 1000
  const [filters, setFilters] = useState<ProductFiltersType>({
    sortBy: "title",
    sortOrder: "asc",
  })
  const { toast } = useToast()

  const productsPerPage = 10

  // Helper function to normalize category names for comparison
  const normalizeCategory = useCallback((category: string) => {
    return category.toLowerCase().replace(/\s+/g, '-').trim()
  }, [])

  // Generate unique local ID
  const generateLocalId = useCallback(() => {
    const id = nextLocalId
    setNextLocalId(prev => prev + 1)
    return id
  }, [nextLocalId])

  useEffect(() => {
    loadAllProducts()
  }, [])

  // Memoized filter application for better performance
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower),
      )
    }

    // Apply category filter with normalization for spaces/dashes
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((product) => {
        const productCategory = normalizeCategory(product.category)
        const filterCategory = normalizeCategory(filters.category!)
        return productCategory === filterCategory
      })
    }

    // Apply price range filter
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      filtered = filtered.filter((product) => product.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      filtered = filtered.filter((product) => product.price <= filters.maxPrice!)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy as keyof Product]
      let bValue: any = b[filters.sortBy as keyof Product]

      // Handle different data types
      if (filters.sortBy === "price" || filters.sortBy === "rating" || filters.sortBy === "stock") {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue?.toLowerCase() || ""
      }

      if (filters.sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [allProducts, searchTerm, filters, normalizeCategory])

  // Update products when filtered results change
  useEffect(() => {
    setProducts(filteredProducts)
    setTotalProducts(filteredProducts.length)
    
    // Reset to first page when filters change
    if (currentPage > 1) {
      setCurrentPage(1)
    }
  }, [filteredProducts, currentPage])

  const loadAllProducts = async () => {
    try {
      setIsLoading(true)
      // Load ALL products from API
      const response = await productApi.getAll(1000, 0)
      const apiProducts = (response.products || []).map((product: Product) => ({
        ...product,
        isLocal: false
      }))
      
      // Combine API products with local products
      const combinedProducts = [...apiProducts, ...localProducts]
      setAllProducts(combinedProducts)
      setTotalProducts(combinedProducts.length)
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "Failed to load products from server. Showing local products only.",
        variant: "destructive",
      })
      // If API fails, just show local products
      setAllProducts([...localProducts])
      setTotalProducts(localProducts.length)
    } finally {
      setIsLoading(false)
    }
  }

  // Get paginated products for display
  const getPaginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    return products.slice(startIndex, endIndex)
  }, [products, currentPage, productsPerPage])

  // Enhanced pagination logic with sliding window
  const getPaginationPages = useCallback(() => {
    const totalPages = Math.ceil(products.length / productsPerPage)
    const pages = []
    const delta = 2
    const range = []
    
    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      range.unshift('...')
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...')
    }

    range.unshift(1)
    if (totalPages > 1) {
      range.push(totalPages)
    }

    return range.filter((page, index, arr) => {
      return page !== arr[index - 1]
    })
  }, [products.length, currentPage, productsPerPage])

  const handleAddProduct = useCallback(() => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }, [])

  const handleEditProduct = useCallback((product: ExtendedProduct) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }, [])

  const handleViewProduct = useCallback((product: ExtendedProduct) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
  }, [])

  const handleDeleteProduct = useCallback((product: ExtendedProduct) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleProductSubmit = async (productData: any) => {
    try {
      if (selectedProduct) {
        // Update existing product
        if (selectedProduct.isLocal) {
          // Update local product
          const updatedProduct = { ...selectedProduct, ...productData }
          setLocalProducts((prev) => 
            prev.map((prod) => (prod.id === selectedProduct.id ? updatedProduct : prod))
          )
          setAllProducts((prev) => 
            prev.map((prod) => (prod.id === selectedProduct.id ? updatedProduct : prod))
          )
          toast({
            title: "Success",
            description: "Local product updated successfully",
          })
        } else {
          // Update API product
          const updated = await productApi.update(selectedProduct.id, productData)
          setAllProducts((prev) => 
            prev.map((prod) => (prod.id === selectedProduct.id ? { ...updated, isLocal: false } : prod))
          )
          toast({
            title: "Success",
            description: "Product updated successfully",
          })
        }
      } else {
        // Add new product (always local since DummyJSON doesn't persist)
        const localId = generateLocalId()
        const newProduct: ExtendedProduct = {
          id: localId,
          ...productData,
          isLocal: true,
          // Provide default values for missing fields
          rating: productData.rating || 0,
          stock: productData.stock || 0,
          thumbnail: productData.thumbnail || "",
          images: productData.images || [],
        }
        
        setLocalProducts((prev) => [newProduct, ...prev])
        setAllProducts((prev) => [newProduct, ...prev])
        toast({
          title: "Success",
          description: "Product added successfully (stored locally)",
        })
      }
      setIsDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: `Failed to ${selectedProduct ? 'update' : 'add'} product`,
        variant: "destructive",
      })
    }
  }

  const handleProductDelete = async () => {
    if (!selectedProduct) return

    try {
      if (selectedProduct.isLocal) {
        // Delete local product
        setLocalProducts((prev) => prev.filter((prod) => prod.id !== selectedProduct.id))
        setAllProducts((prev) => prev.filter((prod) => prod.id !== selectedProduct.id))
        toast({
          title: "Success",
          description: "Local product deleted successfully",
        })
      } else {
        // Delete API product
        await productApi.delete(selectedProduct.id)
        setAllProducts((prev) => prev.filter((prod) => prod.id !== selectedProduct.id))
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      }
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleClearFilters = useCallback(() => {
    const resetFilters = {
      sortBy: "title",
      sortOrder: "asc",
    }
    setFilters(resetFilters)
    setSearchTerm("")
  }, [])

  const handleFiltersChange = useCallback((newFilters: ProductFiltersType) => {
    setFilters(newFilters)
  }, [])

  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
  }, [])

  const totalPages = Math.ceil(products.length / productsPerPage)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
          <ProductTableSkeleton />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Products</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button onClick={handleAddProduct} className="w-full sm:w-auto shrink-0 cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            <span className="sm:inline">Add Product</span>
          </Button>
        </div>

        {/* Info Alert for Local Products */}
        {localProducts.length > 0 && (
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              You have {localProducts.length} local product{localProducts.length !== 1 ? 's' : ''} that are stored in your browser session. 
              These will persist until you refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Product Filters */}
        <ProductFilters 
          filters={filters} 
          onFiltersChange={handleFiltersChange} 
          onClearFilters={handleClearFilters}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        {/* Products Table */}
        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title={searchTerm || filters.category ? "No products found" : "No products yet"}
            description={
              searchTerm || filters.category
                ? "No products match your search criteria. Try adjusting your search terms or filters."
                : "Get started by adding your first product to your catalog."
            }
            action={
              !searchTerm && !filters.category
                ? {
                    label: "Add Product",
                    onClick: handleAddProduct,
                  }
                : undefined
            }
          />
        ) : (
          <Card className="overflow-hidden border-0 sm:border shadow-sm">
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="block lg:hidden">
                <div className="divide-y divide-border">
                  {getPaginatedProducts.map((product) => (
                    <div key={product.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-sm sm:text-base truncate">{product.title}</h3>
                                {product.isLocal && (
                                  <Badge variant="secondary" className="text-xs px-1 py-0.5">Local</Badge>
                                )}
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewProduct(product)}
                                className="h-8 w-8 p-0 hover:bg-primary/10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                className="h-8 w-8 p-0 hover:bg-primary/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                            <Badge variant="outline" className="text-xs">
                              {product.category.toUpperCase()}
                            </Badge>
                            <span className="font-semibold text-base sm:text-lg">${product.price}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs sm:text-sm">{product.rating || "N/A"}</span>
                            </div>
                            <Badge 
                              variant={product.stock && product.stock > 10 ? "default" : "destructive"}
                              className="text-xs"
                            >
                              Stock: {product.stock || 0}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px] xl:w-[400px]">Product</TableHead>
                      <TableHead className="w-[120px]">Category</TableHead>
                      <TableHead className="w-[100px]">Price</TableHead>
                      <TableHead className="w-[100px]">Rating</TableHead>
                      <TableHead className="w-[80px]">Stock</TableHead>
                      <TableHead className="w-[120px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPaginatedProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 xl:w-12 xl:h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden shrink-0">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail || "/placeholder.svg"}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <Package className="h-5 w-5 xl:h-6 xl:w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-sm xl:text-base truncate">{product.title}</div>
                                {product.isLocal && (
                                  <Badge variant="secondary" className="text-xs px-1 py-0.5">Local</Badge>
                                )}
                              </div>
                              <div className="text-xs xl:text-sm text-muted-foreground truncate max-w-[200px] xl:max-w-[300px]">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {product.category.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-sm xl:text-base">${product.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm xl:text-base">{product.rating || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock && product.stock > 10 ? "default" : "destructive"} className="text-xs">
                            {product.stock || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewProduct(product)}
                              className="h-8 w-8 p-0 hover:bg-primary/10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="h-8 w-8 p-0 hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
              {Math.min(currentPage * productsPerPage, products.length)} of {products.length} products
            </p>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-9 px-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {getPaginationPages().map((page, index) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 py-1 text-muted-foreground">
                        ...
                      </span>
                    )
                  }
                  
                  const pageNum = Number(page)
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="h-9 w-9 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-9 px-3"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onSubmit={handleProductSubmit}
      />

      <ProductViewDialog 
        open={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen} 
        product={selectedProduct} 
      />

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={selectedProduct}
        onConfirm={handleProductDelete}
      />
    </DashboardLayout>
  )
}