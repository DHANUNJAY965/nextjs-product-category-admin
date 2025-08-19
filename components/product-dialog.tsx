"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/types"
import { categoryApi } from "@/lib/api"
import { localStorageApi } from "@/lib/local-storage"

const productSchema = z.object({
  title: z.string().min(1, "Product title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSubmit: (data: ProductFormData) => void
}

export function ProductDialog({ open, onOpenChange, product, onSubmit }: ProductDialogProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      thumbnail: "",
    },
  })

  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  // Reset form when product changes or dialog opens/closes, but wait for categories to load
  useEffect(() => {
    if (open && !isLoadingCategories) {
      if (product) {
        // Ensure the product category exists in our categories list
        const productCategory = product.category.trim()
        
        // If the category doesn't exist, add it to the list
        if (!categories.includes(productCategory) && productCategory) {
          setCategories(prev => [...prev, productCategory])
        }
        
        // Editing existing product
        reset({
          title: product.title,
          description: product.description,
          price: product.price,
          category: productCategory,
          thumbnail: product.thumbnail || "",
        })
      } else {
        // Adding new product
        reset({
          title: "",
          description: "",
          price: 0,
          category: "",
          thumbnail: "",
        })
      }
    }
  }, [product, open, reset, categories, isLoadingCategories])

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true)
      
      // Get API categories
      const apiCategories = await categoryApi.getAll()
      // Get local categories
      const localCategories = localStorageApi.getCategories()

      const apiCategoryNames = apiCategories.map((category: any) =>
        typeof category === "string" ? category.trim() : category.name?.trim() || "",
      ).filter(Boolean)

      const localCategoryNames = localCategories.map((cat) => cat.name?.trim() || "").filter(Boolean)

      // Combine both sources
      const allCategories = [...apiCategoryNames, ...localCategoryNames]

      // Remove duplicates and normalize category names
      const uniqueCategories = Array.from(new Set(allCategories))
        .filter(cat => cat && cat.length > 0)
        .sort() // Sort alphabetically for better UX

      console.log("Loaded categories:", uniqueCategories)
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error loading categories:", error)
      // Fallback categories in case API fails
      const fallbackCategories = [
        "beauty", "fragrances", "furniture", "groceries", "home-decoration", 
        "kitchen-accessories", "laptops", "mens-shirts", "mens-shoes", 
        "mens-watches", "mobile-accessories", "motorcycle", "skin-care", 
        "smartphones", "sports-accessories", "sunglasses", "tablets", 
        "tops", "vehicle", "womens-bags", "womens-dresses", "womens-jewellery", 
        "womens-shoes", "womens-watches"
      ]
      setCategories(fallbackCategories)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data)
    reset()
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset form when dialog closes
      reset({
        title: "",
        description: "",
        price: 0,
        category: "",
        thumbnail: "",
      })
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update the product details below." : "Create a new product for your catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                placeholder="Enter product title"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("price", { valueAsNumber: true })}
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              rows={3}
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => {
                  // Debug logging
                  console.log("Current field value:", field.value)
                  console.log("Available categories:", categories)
                  console.log("Product category:", product?.category)
                  
                  return (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        console.log("Category changed to:", value)
                        field.onChange(value)
                      }}
                      disabled={isLoadingCategories}
                    >
                      <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                        <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                        {/* Show current product category even if not in list */}
                        {product?.category && !categories.includes(product.category.trim()) && (
                          <SelectItem value={product.category.trim()}>
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)} (Current)
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )
                }}
              />
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Image URL (Optional)</Label>
              <Input
                id="thumbnail"
                placeholder="https://example.com/image.jpg"
                {...register("thumbnail")}
                className={errors.thumbnail ? "border-destructive" : ""}
              />
              {errors.thumbnail && <p className="text-sm text-descriptive">{errors.thumbnail.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}