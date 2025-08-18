export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage?: number
  rating?: number
  stock?: number
  brand?: string
  category: string
  thumbnail?: string
  images?: string[]
}

export interface Category {
  id: string
  name: string
  description?: string
  productCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  data?: T
  products?: Product[]
  categories?: string[]
  total?: number
  skip?: number
  limit?: number
}

export interface ProductFormData {
  title: string
  description: string
  price: number
  category: string
  thumbnail?: string
}

export interface CategoryFormData {
  name: string
  description?: string
}

export type SortOrder = "asc" | "desc"
export type SortField = "title" | "price" | "category" | "rating"

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: SortField
  sortOrder?: SortOrder
}

export type ProductFiltersType = ProductFilters
