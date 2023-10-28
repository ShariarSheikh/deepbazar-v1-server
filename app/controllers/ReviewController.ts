import mongoose from 'mongoose'
import ReviewModel, { IReview } from '../models/Review.Model'

class ReviewController {
  public async allReviewByProductId(id: mongoose.Schema.Types.ObjectId) {
    return await ReviewModel.find({ productId: id })
      .limit(10)
      .populate({
        path: 'user',
        select: 'firstName lastName imgUrl _id'
      })
      .lean()
      .exec()
  }

  public async create(review: IReview) {
    return await ReviewModel.create(review)
  }

  public async findReviewByUserAndProductId(
    productId: mongoose.Schema.Types.ObjectId,
    id: mongoose.Schema.Types.ObjectId
  ) {
    return await ReviewModel.findOne({ 'user._id': id, productId })
  }

  public async getUserAllReviews(id: mongoose.Schema.Types.ObjectId) {
    return await ReviewModel.find({ user: id }).limit(10)
  }

  // public async detailsByProductId(id: mongoose.Schema.Types.ObjectId) {
  //   return await ReviewModel.findById(id)
  // }

  // public async update({ id, product }: { id: mongoose.Schema.Types.ObjectId; product: IProject }) {
  //   return await ReviewModel.findByIdAndUpdate(id, product, { new: true })
  // }

  // public async delete(deleteId: string) {
  //   return await ReviewModel.findByIdAndDelete(deleteId)
  // }

  // public async deleteAllProductByUserId(sellerId: mongoose.Schema.Types.ObjectId) {
  //   return await ReviewModel.deleteMany({ sellerId: sellerId })
  // }
}

export default new ReviewController()