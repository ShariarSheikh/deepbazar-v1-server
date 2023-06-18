import { Document, Schema, model } from 'mongoose'

export interface IProject extends Document {
  product_id: string
  title: string
  description: string
  price: number
  images: string[]
  categories: string[]
  inventory: {
    stock: number
    availability: boolean
  }
  attributes: {
    color: string
    size: string
  }
  reviews: {
    average_rating: number
    total_reviews: number
  }
  related_products: [
    {
      product_id: number
      title: string
      price: number
      image: string
    },
    {
      product_id: number
      title: string
      price: number
      image: number
    }
  ]
  product_url: string
}

const ProductSchema = new Schema<IProject>(
  {
    product_id: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    inventory: {
      stock: { type: Number, required: true },
      availability: { type: Boolean, required: true }
    },
    attributes: {
      color: { type: String, required: true },
      size: { type: String, required: true }
    },
    reviews: {
      average_rating: { type: Number, required: true },
      total_reviews: { type: Number, required: true }
    },
    related_products: [
      {
        product_id: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: [String], required: true }
      }
    ],
    product_url: { type: String, required: true }
  },
  { timestamps: true }
)

const ProductModel = model<IProject>('Product', ProductSchema)
export default ProductModel
