export interface Category {
  id: string
  name: string
  parentId?: string
  imageUrl?: string
  sortOrder?: number
  subcategories?: Category[]
}

/** Flattens a category tree (parents + nested subcategories) into a single list. */
export function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = []
  for (const category of categories) {
    result.push(category)
    if (category.subcategories?.length) {
      result.push(...flattenCategories(category.subcategories))
    }
  }
  return result
}
