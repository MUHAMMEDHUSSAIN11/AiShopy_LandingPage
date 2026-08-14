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

/** Selected category id plus all nested subcategory ids. */
export function collectSubtreeCategoryIds(
  categories: Category[],
  rootId: string,
): Set<string> | null {
  const find = (nodes: Category[]): Category | null => {
    for (const node of nodes) {
      if (node.id === rootId) return node
      if (node.subcategories?.length) {
        const nested = find(node.subcategories)
        if (nested) return nested
      }
    }
    return null
  }

  const root = find(categories)
  if (!root) return null

  return new Set(flattenCategories([root]).map((c) => c.id))
}

export function filterProductsByCategorySubtree<T extends { categoryId: string }>(
  products: T[],
  categories: Category[],
  categoryId: string,
): T[] {
  if (!categoryId) return products
  const allowed = collectSubtreeCategoryIds(categories, categoryId)
  if (!allowed) return []
  return products.filter((p) => allowed.has(p.categoryId))
}
