/* eslint-disable @typescript-eslint/ban-ts-comment */
import mongoose from 'mongoose'
import ProductModel, { IProject } from '../models/Product.Model'

class ProductController {
  //@ts-ignore
  public async listWithQuery(query) {
    const limit = query.limit
    const skip = (query.pageLength - 1) * limit

    //@ts-ignore
    delete query.limit
    //@ts-ignore
    delete query.pageLength

    return await ProductModel.find(query).limit(limit).skip(skip)
  }

  public async listBySellerId(query: { sellerId: string; limit: number }) {
    const { sellerId, limit } = query

    return await ProductModel.find({ sellerId: sellerId }).limit(limit)
  }

  public async detailsByProductId(id: mongoose.Schema.Types.ObjectId) {
    return await ProductModel.findById(id)
  }

  public async create(project: IProject) {
    return await ProductModel.create(project)
  }

  public async update({ id, product }: { id: mongoose.Schema.Types.ObjectId; product: IProject }) {
    return await ProductModel.findByIdAndUpdate(id, product, { new: true })
  }

  public async delete(deleteId: string) {
    return await ProductModel.findByIdAndDelete(deleteId)
  }

  public async deleteAllProductByUserId(sellerId: mongoose.Schema.Types.ObjectId) {
    return await ProductModel.deleteMany({ sellerId: sellerId })
  }
}

export default new ProductController()
