import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IWishlist extends Document {
  title: string
  imgUrl: string
  price: number
  discountPrice: number
  discountPercent: number
  user: Schema.Types.ObjectId
  product: Schema.Types.ObjectId
}

const wishListSchema = new Schema<IWishlist>({
  title: { type: String, required: true },
  imgUrl: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  discountPercent: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Products', required: true }
})

const WishlistModel: Model<IWishlist> = mongoose.model('Wishlist', wishListSchema)

export default WishlistModel
