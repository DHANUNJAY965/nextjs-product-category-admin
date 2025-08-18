"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package, Eye, Star } from "lucide-react"
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [filters, setFilters] = useState<ProductFiltersType>({
    sortBy: "title",
    sortOrder: "asc",
  })
  const { toast } = useToast()

  const productsPerPage = 10

  // Helper function to normalize category names for comparison
  const normalizeCategory = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, '-').trim()
  }

  useEffect(() => {
    loadAllProducts() // Load all products initially
  }, [])

  // Only apply filters when filters or searchTerm change
  useEffect(() => {
    applyFilters()
  }, [allProducts, searchTerm, filters])

  const loadAllProducts = async () => {
    try {
      setIsLoading(true)
      // Load ALL products (remove pagination for filtering)
      const response = await productApi.getAll(1000, 0) // Get a large number to fetch all
      setAllProducts(response.products || [])
      setTotalProducts(response.total || 0)
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadProducts = async () => {
    // This function can be used if you want to reload data
    await loadAllProducts()
  }

  const applyFilters = () => {
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
        console.log("[v0] Comparing:", productCategory, "===", filterCategory)
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

    // Set filtered products and update total count for pagination
    setProducts(filtered)
    setTotalProducts(filtered.length)
    
    // Reset to first page when filters change
    if (currentPage > 1) {
      setCurrentPage(1)
    }
  }

  // Get paginated products for display
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    return products.slice(startIndex, endIndex)
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleProductSubmit = async (productData: any) => {
    try {
      if (selectedProduct) {
        // Update existing product
        const updated = await productApi.update(selectedProduct.id, productData)
        setAllProducts((prev) => prev.map((prod) => (prod.id === selectedProduct.id ? updated : prod)))
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      } else {
        // Add new product
        const newProduct = await productApi.create(productData)
        setAllProducts((prev) => [newProduct, ...prev.slice(0, -1)]) // Replace last item to maintain pagination
        toast({
          title: "Success",
          description: "Product added successfully",
        })
      }
      setIsDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  const handleProductDelete = async () => {
    if (!selectedProduct) return

    try {
      await productApi.delete(selectedProduct.id)
      setAllProducts((prev) => prev.filter((prod) => prod.id !== selectedProduct.id))
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
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

  const handleClearFilters = () => {
    const resetFilters = {
      sortBy: "title",
      sortOrder: "asc",
    }
    setFilters(resetFilters)
    setSearchTerm("")
  }

  // Handle filter changes from ProductFilters component
  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters)
  }

  // Handle search changes from ProductFilters component
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
  }

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button onClick={handleAddProduct} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

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
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPaginatedProducts().map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail || "/placeholder.svg"}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{product.title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category.toLocaleUpperCase()}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">${product.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock && product.stock > 10 ? "default" : "destructive"}>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
              {Math.min(currentPage * productsPerPage, products.length)} of {products.length} products
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
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

      <ProductViewDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} product={selectedProduct} />

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={selectedProduct}
        onConfirm={handleProductDelete}
      />
    </DashboardLayout>
  )
}