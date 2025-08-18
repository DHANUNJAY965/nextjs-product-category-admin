import type { Category } from "@/types"

const CATEGORIES_KEY = "product-manager-categories"

export const localStorageApi = {
  getCategories(): Category[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(CATEGORIES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading categories from localStorage:", error)
      return []
    }
  },

  saveCategories(categories: Category[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
    } catch (error) {
      console.error("Error saving categories to localStorage:", error)
    }
  },

  addCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">): Category {
    const categories = this.getCategories()
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    categories.push(newCategory)
    this.saveCategories(categories)
    return newCategory
  },

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categories = this.getCategories()
    const index = categories.findIndex((cat) => cat.id === id)

    if (index === -1) return null

    categories[index] = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveCategories(categories)
    return categories[index]
  },

  deleteCategory(id: string): boolean {
    const categories = this.getCategories()
    const filtered = categories.filter((cat) => cat.id !== id)

    if (filtered.length === categories.length) return false

    this.saveCategories(filtered)
    return true
  },

  initializeWithApiCategories(apiCategories: string[] | { slug: string; name: string; url: string }[]): void {
    const existingCategories = this.getCategories()

    if (existingCategories.length === 0) {
      const initialCategories: Category[] = apiCategories.map((category, index) => {
        const categoryName = typeof category === "string" ? category : category.name
        return {
          id: (index + 1).toString(),
          name: categoryName,
          description: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} products`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })

      this.saveCategories(initialCategories)
    }
  },
}
