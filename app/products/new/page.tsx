// // "use client"

// // import { useState, useEffect } from "react"
// // import { useRouter } from "next/navigation"
// // import { DashboardLayout } from "@/components/dashboard-layout"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Label } from "@/components/ui/label"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { ArrowLeft, Package } from "lucide-react"
// // import { useForm } from "react-hook-form"
// // import { zodResolver } from "@hookform/resolvers/zod"
// // import * as z from "zod"
// // import { productApi, categoryApi } from "@/lib/api"
// // import { localStorageApi } from "@/lib/local-storage"
// // import { useToast } from "@/hooks/use-toast"
// // import Link from "next/link"

// // const productSchema = z.object({
// //   title: z.string().min(1, "Product title is required").max(100, "Title must be less than 100 characters"),
// //   description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
// //   price: z.number().min(0.01, "Price must be greater than 0"),
// //   category: z.string().min(1, "Category is required"),
// //   thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
// // })

// // type ProductFormData = z.infer<typeof productSchema>

// // export default function NewProductPage() {
// //   const router = useRouter()
// //   const { toast } = useToast()
// //   const [isSubmitting, setIsSubmitting] = useState(false)
// //   const [categories, setCategories] = useState<string[]>([])
// //   const [isLoadingCategories, setIsLoadingCategories] = useState(false)

// //   const {
// //     register,
// //     handleSubmit,
// //     setValue,
// //     watch,
// //     formState: { errors },
// //   } = useForm<ProductFormData>({
// //     resolver: zodResolver(productSchema),
// //     defaultValues: {
// //       title: "",
// //       description: "",
// //       price: 0,
// //       category: "",
// //       thumbnail: "",
// //     },
// //   })

// //   const selectedCategory = watch("category")

// //   useEffect(() => {
// //     loadCategories()
// //   }, [])

// //   const loadCategories = async () => {
// //     try {
// //       setIsLoadingCategories(true)
// //       // Get API categories
// //       const apiCategories = await categoryApi.getAll()
// //       // Get local categories
// //       const localCategories = localStorageApi.getCategories()

// //       // Combine both sources
// //       const allCategories = [...apiCategories, ...localCategories.map((cat) => cat.name)]

// //       // Remove duplicates
// //       const uniqueCategories = Array.from(new Set(allCategories))
// //       setCategories(uniqueCategories)
// //     } catch (error) {
// //       console.error("Error loading categories:", error)
// //     } finally {
// //       setIsLoadingCategories(false)
// //     }
// //   }

// //   const onSubmit = async (data: ProductFormData) => {
// //     try {
// //       setIsSubmitting(true)
// //       await productApi.create(data)

// //       toast({
// //         title: "Success",
// //         description: "Product created successfully",
// //       })

// //       router.push("/products")
// //     } catch (error) {
// //       console.error("Error creating product:", error)
// //       toast({
// //         title: "Error",
// //         description: "Failed to create product",
// //         variant: "destructive",
// //       })
// //     } finally {
// //       setIsSubmitting(false)
// //     }
// //   }

// //   return (
// //     <DashboardLayout>
// //       <div className="max-w-2xl mx-auto space-y-6">
// //         {/* Header */}
// //         <div className="flex items-center gap-4">
// //           <Link href="/products">
// //             <Button variant="ghost" size="sm">
// //               <ArrowLeft className="mr-2 h-4 w-4" />
// //               Back to Products
// //             </Button>
// //           </Link>
// //         </div>

// //         <div>
// //           <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
// //           <p className="text-muted-foreground">Create a new product for your catalog</p>
// //         </div>

// //         {/* Form */}
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center">
// //               <Package className="mr-2 h-5 w-5" />
// //               Product Details
// //             </CardTitle>
// //             <CardDescription>Fill in the information below to create a new product</CardDescription>
// //           </CardHeader>
// //           <CardContent>
// //             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="title">Product Title *</Label>
// //                   <Input
// //                     id="title"
// //                     placeholder="Enter product title"
// //                     {...register("title")}
// //                     className={errors.title ? "border-destructive" : ""}
// //                   />
// //                   {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="price">Price ($) *</Label>
// //                   <Input
// //                     id="price"
// //                     type="number"
// //                     step="0.01"
// //                     placeholder="0.00"
// //                     {...register("price", { valueAsNumber: true })}
// //                     className={errors.price ? "border-destructive" : ""}
// //                   />
// //                   {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
// //                 </div>
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="description">Description *</Label>
// //                 <Textarea
// //                   id="description"
// //                   placeholder="Enter product description"
// //                   rows={4}
// //                   {...register("description")}
// //                   className={errors.description ? "border-destructive" : ""}
// //                 />
// //                 {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
// //               </div>

// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="category">Category *</Label>
// //                   <Select
// //                     value={selectedCategory}
// //                     onValueChange={(value) => setValue("category", value)}
// //                     disabled={isLoadingCategories}
// //                   >
// //                     <SelectTrigger className={errors.category ? "border-destructive" : ""}>
// //                       <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select category"} />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {categories.map((category) => (
// //                         <SelectItem key={category} value={category}>
// //                           {category}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                   {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="thumbnail">Image URL</Label>
// //                   <Input
// //                     id="thumbnail"
// //                     placeholder="https://example.com/image.jpg"
// //                     {...register("thumbnail")}
// //                     className={errors.thumbnail ? "border-destructive" : ""}
// //                   />
// //                   {errors.thumbnail && <p className="text-sm text-destructive">{errors.thumbnail.message}</p>}
// //                   <p className="text-xs text-muted-foreground">Optional: Provide a URL to an image for this product</p>
// //                 </div>
// //               </div>

// //               <div className="flex gap-4 pt-4">
// //                 <Link href="/products" className="flex-1">
// //                   <Button type="button" variant="outline" className="w-full bg-transparent">
// //                     Cancel
// //                   </Button>
// //                 </Link>
// //                 <Button type="submit" disabled={isSubmitting} className="flex-1">
// //                   {isSubmitting ? "Creating..." : "Create Product"}
// //                 </Button>
// //               </div>
// //             </form>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </DashboardLayout>
// //   )
// // }
// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { DashboardLayout } from "@/components/dashboard-layout"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ArrowLeft, Package } from "lucide-react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { productApi, categoryApi } from "@/lib/api"
// import { localStorageApi } from "@/lib/local-storage"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"

// const productSchema = z.object({
//   title: z.string().min(1, "Product title is required").max(100, "Title must be less than 100 characters"),
//   description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
//   price: z.number().min(0.01, "Price must be greater than 0"),
//   category: z.string().min(1, "Category is required"),
//   thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
// })

// type ProductFormData = z.infer<typeof productSchema>

// type Category = {
//   slug: string
//   name: string
//   url?: string
// }

// export default function NewProductPage() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [categories, setCategories] = useState<Category[]>([])
//   const [isLoadingCategories, setIsLoadingCategories] = useState(false)

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<ProductFormData>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       price: 0,
//       category: "",
//       thumbnail: "",
//     },
//   })

//   const selectedCategory = watch("category")

//   useEffect(() => {
//     loadCategories()
//   }, [])

//   const loadCategories = async () => {
//     try {
//       setIsLoadingCategories(true)
//       // Get API categories
//       const apiCategories: Category[] = await categoryApi.getAll()
//       // Get local categories (convert to same shape)
//       const localCategories = localStorageApi.getCategories().map((cat: any) => ({
//         slug: cat.slug || cat.name,
//         name: cat.name,
//         url: cat.url || "",
//       }))

//       // Combine both sources
//       const allCategories = [...apiCategories, ...localCategories]

//       // Remove duplicates by slug
//       const uniqueCategories = Array.from(
//         new Map(allCategories.map((cat) => [cat.slug, cat])).values()
//       )

//       setCategories(uniqueCategories)
//     } catch (error) {
//       console.error("Error loading categories:", error)
//     } finally {
//       setIsLoadingCategories(false)
//     }
//   }

//   const onSubmit = async (data: ProductFormData) => {
//     try {
//       setIsSubmitting(true)
//       await productApi.create(data)

//       toast({
//         title: "Success",
//         description: "Product created successfully",
//       })

//       router.push("/products")
//     } catch (error) {
//       console.error("Error creating product:", error)
//       toast({
//         title: "Error",
//         description: "Failed to create product",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <DashboardLayout>
//       <div className="max-w-2xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center gap-4">
//           <Link href="/products">
//             <Button variant="ghost" size="sm">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Products
//             </Button>
//           </Link>
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
//           <p className="text-muted-foreground">Create a new product for your catalog</p>
//         </div>

//         {/* Form */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Package className="mr-2 h-5 w-5" />
//               Product Details
//             </CardTitle>
//             <CardDescription>Fill in the information below to create a new product</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Product Title *</Label>
//                   <Input
//                     id="title"
//                     placeholder="Enter product title"
//                     {...register("title")}
//                     className={errors.title ? "border-destructive" : ""}
//                   />
//                   {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="price">Price ($) *</Label>
//                   <Input
//                     id="price"
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     {...register("price", { valueAsNumber: true })}
//                     className={errors.price ? "border-destructive" : ""}
//                   />
//                   {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description">Description *</Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Enter product description"
//                   rows={4}
//                   {...register("description")}
//                   className={errors.description ? "border-destructive" : ""}
//                 />
//                 {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="category">Category *</Label>
//                   <Select
//                     value={selectedCategory}
//                     onValueChange={(value) => setValue("category", value)}
//                     disabled={isLoadingCategories}
//                   >
//                     <SelectTrigger className={errors.category ? "border-destructive" : ""}>
//                       <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select category"} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((category) => (
//                         <SelectItem key={category.slug} value={category.slug}>
//                           {category.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="thumbnail">Image URL</Label>
//                   <Input
//                     id="thumbnail"
//                     placeholder="https://example.com/image.jpg"
//                     {...register("thumbnail")}
//                     className={errors.thumbnail ? "border-destructive" : ""}
//                   />
//                   {errors.thumbnail && <p className="text-sm text-destructive">{errors.thumbnail.message}</p>}
//                   <p className="text-xs text-muted-foreground">Optional: Provide a URL to an image for this product</p>
//                 </div>
//               </div>

//               <div className="flex gap-4 pt-4">
//                 <Link href="/products" className="flex-1">
//                   <Button type="button" variant="outline" className="w-full bg-transparent">
//                     Cancel
//                   </Button>
//                 </Link>
//                 <Button type="submit" disabled={isSubmitting} className="flex-1">
//                   {isSubmitting ? "Creating..." : "Create Product"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { productApi, categoryApi } from "@/lib/api"
import { localStorageApi } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const productSchema = z.object({
  title: z.string().min(1, "Product title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Price must be greater than 0",
    }),
  category: z.string().min(1, "Category is required"),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type ProductFormData = z.infer<typeof productSchema>

type Category = {
  slug: string
  name: string
  url?: string
}

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
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

  const selectedCategory = watch("category")

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true)
      // Get API categories
      const apiCategories: Category[] = await categoryApi.getAll()
      // Get local categories (convert to same shape)
      const localCategories = localStorageApi.getCategories().map((cat: any) => ({
        slug: cat.slug || cat.name,
        name: cat.name,
        url: cat.url || "",
      }))

      // Combine both sources
      const allCategories = [...apiCategories, ...localCategories]

      // Remove duplicates by slug
      const uniqueCategories = Array.from(new Map(allCategories.map((cat) => [cat.slug, cat])).values())

      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true)

      // ✅ Ensure price is a number
      const payload = {
        ...data,
        price: Number(data.price),
      }

      const newProduct = await productApi.create(payload)

      toast({
        title: "Success",
        description: `Product "${newProduct.title}" created successfully`,
      })

      // ✅ Reset form
      reset()

      // ✅ Redirect to product list
      router.push("/products")
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to create product",
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
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product for your catalog</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Product Details
            </CardTitle>
            <CardDescription>Fill in the information below to create a new product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter product title"
                    {...register("title")}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("price")}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setValue("category", value)}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Image URL</Label>
                  <Input
                    id="thumbnail"
                    placeholder="https://example.com/image.jpg"
                    {...register("thumbnail")}
                    className={errors.thumbnail ? "border-destructive" : ""}
                  />
                  {errors.thumbnail && <p className="text-sm text-destructive">{errors.thumbnail.message}</p>}
                  <p className="text-xs text-muted-foreground">Optional: Provide a URL to an image for this product</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/products" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
