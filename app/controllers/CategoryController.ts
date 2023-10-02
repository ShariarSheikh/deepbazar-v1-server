import CategoriesModel, { ICategory } from '../models/Categories.model'

class CategoryController {
  public async get() {
    return await CategoriesModel.find()
  }

  public async create(category: ICategory) {
    return await CategoriesModel.create(category)
  }

  public async updateById({ id, category }: { id: string; category: ICategory }) {
    return await CategoriesModel.findByIdAndUpdate(id, category, { new: true })
  }
}

export default new CategoryController()
