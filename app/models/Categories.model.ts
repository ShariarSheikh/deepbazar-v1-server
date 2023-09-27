import { Document, Schema, model } from 'mongoose'

export interface ICategory extends Document {
  imgUrl: string
  name: string
  totalItems: number
  pageUrl: string
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    imgUrl: { type: String, required: true },
    name: { type: String, required: true },
    totalItems: { type: Number, required: true },
    pageUrl: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

const CategoriesModel = model<ICategory>('Category', CategorySchema)
export default CategoriesModel
