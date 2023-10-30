import { Document, Schema, model } from 'mongoose'

export interface IShippingAddress extends Document {
  firstName: string
  lastName: string
  email: string
  phone: string
  division: string
  district: string
  thana: string
  address: string
  user: Schema.Types.ObjectId
  isDefault: boolean
}

const shippingAddressSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    thana: { type: String, required: true },
    address: { type: String, required: true },
    user: { type: String, required: true, ref: 'Auth' },
    isDefault: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
)

const ShippingAddressModel = model<IShippingAddress>('ShippingAddress', shippingAddressSchema)
export default ShippingAddressModel
