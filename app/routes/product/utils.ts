export interface ProductListQueryType {
  pageLength?: number
  limit: number
  category?: string
  discountPercent?: {
    $gte?: number
  }
  productSectionName?: string
  price: {
    $gte?: number
    $lte?: number
  }
}
interface ProductListApiQueryFilter {
  category?: string
  pageLength?: number
  limit?: number
  discountPercentUpTo?: number
  startPrice?: number
  endPrice?: number
  productSectionName?: string
}

export function ProductListApiQueryFilter({
  category,
  pageLength = 1,
  limit = 10,
  startPrice = 1,
  endPrice = 100000000,
  discountPercentUpTo,
  productSectionName
}: ProductListApiQueryFilter): ProductListQueryType {
  //@ts-expect-error
  const query: ProductListQueryType = {
    pageLength,
    limit
  }

  if (typeof discountPercentUpTo !== 'undefined' && discountPercentUpTo > 0)
    query.discountPercent = { $gte: Number(discountPercentUpTo) }

  if (category) query.category = category.charAt(0).toUpperCase() + category.slice(1)
  if (pageLength > 0) query.pageLength = Number(pageLength)
  if (limit > 0) query.limit = Number(limit)
  if (startPrice > 0) query.price = { $gte: startPrice }
  if (endPrice > 0) query.price = { ...query.price, $lte: endPrice }
  if (productSectionName) query.productSectionName = productSectionName

  return query
}

export function formatPrice(price: number): number {
  const value = Number(price)

  if (!Number.isInteger(value)) return Number(value.toFixed(2))
  return value
}
