import { Document, Schema, model } from 'mongoose'

export const ProductStatus = {
  Pending: 'Pending',
  Approved: 'Active',
  Testing: 'Testing'
} as const

export const ProductSectionName = {
  NewArrivals: 'New Arrivals',
  FeaturedProducts: 'Featured Products',
  JustForYou: 'Just For You!'
} as const

export type ProductStatusType = (typeof ProductStatus)[keyof typeof ProductStatus]
export type ProductSectionNameType = (typeof ProductSectionName)[keyof typeof ProductSectionName]

export interface IProject extends Document {
  title: string
  productCode: string
  productId: string
  status: ProductStatusType
  category: string[]
  productSectionName: ProductSectionNameType

  sellerId: Schema.Types.ObjectId

  ratings: {
    star: number
    totalReviews: number
  }
  totalAnswers: number
  totalWishlist: number

  price: number
  discountPrice?: number
  discountPercent?: number

  offerText?: string
  inStock: boolean

  images: Array<{
    isDefault: boolean
    defaultImg: string
    cardImg: string
    displayImg: string
    commentImg: string
  }>

  description: string
  specification?: string
  tags: string[]
}

const productSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    productCode: { type: String, required: true, unique: true },
    productId: { type: String, required: true, unique: true },
    status: { type: String, enum: Object.values(ProductStatus), required: true },
    category: { type: [String], required: true },
    productSectionName: { type: String, enum: Object.values(ProductSectionName), required: true },
    sellerId: { type: Schema.Types.ObjectId, required: true },
    ratings: {
      star: { type: Number, required: true },
      totalReviews: { type: Number, required: true }
    },
    totalAnswers: { type: Number, required: true },
    totalWishlist: { type: Number, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    discountPercent: { type: Number },
    offerText: { type: String },
    inStock: { type: Boolean, required: true },
    images: [
      {
        isDefault: { type: Boolean, required: true },
        defaultImg: { type: String, required: true },
        cardImg: { type: String, required: true },
        displayImg: { type: String, required: true },
        commentImg: { type: String, required: true }
      }
    ],
    description: { type: String, required: true },
    specification: { type: String },
    tags: { type: [String], required: true }
  },
  { timestamps: true }
)

const ProductModel = model<IProject>('Products', productSchema)
export default ProductModel
