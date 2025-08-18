const API_BASE_URL = "https://dummyjson.com"

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Product API functions
export const productApi = {
  async getAll(limit = 30, skip = 0) {
    try {
      const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}`)
      if (!response.ok) throw new ApiError("Failed to fetch products", response.status)
      return await response.json()
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError("Network error occurred")
    }
  },

  async getById(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      if (!response.ok) throw new ApiError("Failed to fetch product", response.status)
      return await response.json()
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError("Network error occurred")
    }
  },

  async create(product: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      if (!response.ok) throw new ApiError("Failed to create product", response.status)
      return await response.json()
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError("Network error occurred")
    }
  },

  async update(id: number, product: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      if (!response.ok) throw new ApiError("Failed to update product", response.status)
      return await response.json()
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError("Network error occurred")
    }
  },

  async delete(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new ApiError("Failed to delete product", response.status)
      return await response.json()
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError("Network error occurred")
    }
  },

  async search(query: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new ApiError("Failed to search products", response.status)
      return await response.json()
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError("Network error occurred")
    }
  },

  async getByCategory(category: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`)
      if (!response.ok) throw new ApiError("Failed to fetch products by category", response.status)
      return await response.json()
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError("Network error occurred")
    }
  },
}

// Category API functions
export const categoryApi = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`)
      if (!response.ok) throw new ApiError("Failed to fetch categories", response.status)
      const data = await response.json()

      return Array.isArray(data) ? data : []
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError("Network error occurred")
    }
  },
}
