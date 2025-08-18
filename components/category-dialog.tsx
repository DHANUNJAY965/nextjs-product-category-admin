"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import type { Category } from "@/types"

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSubmit: (data: CategoryFormData) => void
}

export function CategoryDialog({ open, onOpenChange, category, onSubmit }: CategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || "",
      })
    } else {
      reset({
        name: "",
        description: "",
      })
    }
  }, [category, reset])

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {category ? "Update the category details below." : "Create a new category for your products."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="Enter category name"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter category description"
              rows={3}
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : category ? "Update Category" : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
