"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react"
import { CategoryDialog } from "@/components/category-dialog"
import { DeleteCategoryDialog } from "@/components/delete-category-dialog"
import { EmptyState } from "@/components/empty-state"
import { CategoryGridSkeleton } from "@/components/loading-skeleton"
import { localStorageApi } from "@/lib/local-storage"
import { categoryApi } from "@/lib/api"
import type { Category } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      // First, try to get API categories to initialize local storage
      const apiCategories = await categoryApi.getAll()
      localStorageApi.initializeWithApiCategories(apiCategories)

      // Then load from local storage
      const localCategories = localStorageApi.getCategories()
      setCategories(localCategories)
    } catch (error) {
      console.error("Error loading categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleCategorySubmit = (categoryData: { name: string; description?: string }) => {
    try {
      if (selectedCategory) {
        // Update existing category
        const updated = localStorageApi.updateCategory(selectedCategory.id, categoryData)
        if (updated) {
          setCategories((prev) => prev.map((cat) => (cat.id === selectedCategory.id ? updated : cat)))
          toast({
            title: "Success",
            description: "Category updated successfully",
          })
        }
      } else {
        // Add new category
        const newCategory = localStorageApi.addCategory(categoryData)
        setCategories((prev) => [...prev, newCategory])
        toast({
          title: "Success",
          description: "Category added successfully",
        })
      }
      setIsDialogOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      })
    }
  }

  const handleCategoryDelete = () => {
    if (!selectedCategory) return

    try {
      const success = localStorageApi.deleteCategory(selectedCategory.id)
      if (success) {
        setCategories((prev) => prev.filter((cat) => cat.id !== selectedCategory.id))
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
      }
      setIsDeleteDialogOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <CategoryGridSkeleton />
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
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground">Manage your product categories</p>
          </div>
          <Button onClick={handleAddCategory} className="w-full sm:w-auto cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <EmptyState
            icon={Tag}
            title={searchTerm ? "No categories found" : "No categories yet"}
            description={
              searchTerm
                ? "No categories match your search criteria. Try adjusting your search terms."
                : "Get started by creating your first category to organize your products."
            }
            action={
              !searchTerm
                ? {
                    label: "Add Category",
                    onClick: handleAddCategory,
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 min-h-[2.5rem]">
                    {category.description || "No description provided"}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Products: {category.productCount || 0}</span>
                    <span>
                      Created: {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        onSubmit={handleCategorySubmit}
      />

      <DeleteCategoryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        category={selectedCategory}
        onConfirm={handleCategoryDelete}
      />
    </DashboardLayout>
  )
}
