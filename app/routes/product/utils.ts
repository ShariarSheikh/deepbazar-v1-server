interface QueryType {
  pageLength?: number
  limit: number
  category?: string
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
  productSectionName
}: ProductListApiQueryFilter): QueryType {
  //@ts-expect-error
  const query: QueryType = {
    pageLength,
    limit
  }

  if (category) query.category = category.charAt(0).toUpperCase() + category.slice(1)
  if (pageLength > 0) query.pageLength = pageLength
  if (limit > 0) query.limit = limit

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
