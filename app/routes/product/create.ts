/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, Router } from 'express'
import asyncHandler from 'express-async-handler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'

//----------------------------------

//----------------------------------
const createRoutes = Router()

createRoutes.post(
  '/create',
  //@ts-expect-error
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)
    const createProject = await ProductController.create(req.body)
    response.success({ project: createProject })
  })
)

export default createRoutes

const a = {
  product_id: '123456',
  title: 'Example Product',
  description: 'This is an example product with various features and specifications.',
  price: 29.99,
  images: ['https://example.com/images/product1.jpg', 'https://example.com/images/product1_2.jpg'],
  categories: ['Electronics', 'Smartphones'],
  inventory: {
    stock: 10,
    availability: true
  },
  attributes: {
    color: 'Black',
    size: 'Medium'
  },
  reviews: {
    average_rating: 4.5,
    total_reviews: 50
  },
  related_products: [
    {
      product_id: '987654',
      title: 'Related Product 1',
      price: 19.99,
      image: 'https://example.com/images/related1.jpg'
    },
    {
      product_id: '654321',
      title: 'Related Product 2',
      price: 39.99,
      image: 'https://example.com/images/related2.jpg'
    }
  ],
  product_url: 'https://example.com/products/123456'
}
