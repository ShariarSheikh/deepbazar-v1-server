import mongoose from 'mongoose'
import ProductModel, { IProject } from '../models/Product.Model'

class ProductController {
  public async list() {
    return await ProductModel.find()
  }

  public async details(id: string) {
    return await ProductModel.findById(id)
  }

  public async search(searchQuery: string) {
    return await ProductModel.find({
      $or: [{ title: { $regex: searchQuery, $options: 'i' } }, { description: { $regex: searchQuery, $options: 'i' } }]
    })
  }

  public async create(project: IProject) {
    return await ProductModel.create(project)
  }

  public async update({ id, product }: { id: string; product: IProject }) {
    return await ProductModel.findByIdAndUpdate(id, product)
  }

  public async delete(deleteId: string) {
    return await ProductModel.findByIdAndDelete(deleteId)
  }

  public async deleteAllProductByUserId(userId: mongoose.Schema.Types.ObjectId) {
    return await ProductModel.deleteMany({ sellerId: userId })
  }
}

export default new ProductController()
