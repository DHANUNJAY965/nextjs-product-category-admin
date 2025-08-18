"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Category } from "@/types"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onConfirm: () => void
}

export function DeleteCategoryDialog({ open, onOpenChange, category, onConfirm }: DeleteCategoryDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the category "{category?.name}"? This action cannot be undone.
            {category?.productCount && category.productCount > 0 && (
              <span className="block mt-2 text-destructive font-medium">
                Warning: This category has {category.productCount} products associated with it.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
