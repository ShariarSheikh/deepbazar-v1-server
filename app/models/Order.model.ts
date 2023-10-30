import mongoose, { Document, Schema, Model } from 'mongoose'

export const OrderStatus = {
  Pending: 'Pending',
  Received: 'Received',
  Rejected: 'Rejected'
} as const

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus]

interface OrderItem {
  title: string
  imgUrl: string
  price: number
  discountPrice: number
  discountPercent: number
  productId: string
  cartQuantity: number
}

export interface IOrder extends Document {
  user: Schema.Types.ObjectId
  orderId: string
  status: OrderStatusType
  totalAmount: number
  subtotalAmount: number
  shippingFee: number
  imgUrl: string
  items: OrderItem[]
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    orderId: { type: String, required: true, unique: true },
    status: { type: String, enum: Object.values(OrderStatus), required: true },
    totalAmount: { type: Number, required: true },
    subtotalAmount: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    imgUrl: { type: String, require: true },
    items: [
      {
        title: { type: String, required: true },
        imgUrl: { type: String, required: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number, required: true },
        discountPercent: { type: Number, required: true },
        productId: { type: String, required: true },
        cartQuantity: { type: Number, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
)

const OrderModel: Model<IOrder> = mongoose.model('Order', orderSchema)

export default OrderModel
