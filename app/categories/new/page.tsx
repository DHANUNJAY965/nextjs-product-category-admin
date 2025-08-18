"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Tag } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { localStorageApi } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

export default function NewCategoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true)
      const newCategory = localStorageApi.addCategory(data)

      toast({
        title: "Success",
        description: "Category created successfully",
      })

      router.push("/categories")
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/categories">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Category</h1>
          <p className="text-muted-foreground">Create a new category to organize your products</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Category Details
            </CardTitle>
            <CardDescription>Fill in the information below to create a new category</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter category description (optional)"
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                <p className="text-xs text-muted-foreground">
                  Provide a brief description to help identify this category
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/categories" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
