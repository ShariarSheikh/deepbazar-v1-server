import { ProductImageType } from '../models/Product.Model'
import { deleteImgFromCloudinary, uploadProductImages } from './cloudinaryUtils'

interface UpdateProfileImageHandlerProps {
  imgInDb: ProductImageType[]
  imgInRequest: ProductImageType[]
  files: Express.Multer.File[]
}

export default async function updateProfileImageHandler({
  imgInRequest,
  imgInDb,
  files
}: UpdateProfileImageHandlerProps) {
  const deletableImgs: string[] = []
  const notDeletableImgs: ProductImageType[] = []
  let newImages: ProductImageType[] = []

  // THE CONDITION IS: CHECK THE PRODUCT DATABASE IMAGES,
  // AND THEN CHECK THE UPDATED REQUEST BODY IMAGES LIST,
  // IF DATABASE IMAGE DOSE'T EXIT IN BODY THEN REMOVE DATABASE IMAGES

  if (imgInRequest?.length > 0) {
    imgInDb.forEach((dbImg) => {
      const existsInRequest = imgInRequest.some((currentImg) => currentImg.publicId === dbImg.publicId)

      if (existsInRequest) {
        notDeletableImgs.push(dbImg)
      } else {
        deletableImgs.push(dbImg.publicId)
      }
    })
  } else if (files?.length && !imgInRequest?.length) {
    imgInDb.forEach((imgData) => {
      deletableImgs.push(imgData.publicId)
    })
  }

  // REMOVE
  deletableImgs.forEach((publicId) => {
    deleteImgFromCloudinary(publicId)
  })

  // IF FILES EXITS IN REQUEST THEN UPDATE
  if (files?.length) {
    const images = await uploadProductImages({ files: files })
    newImages = [...images]
  }

  return [...newImages, ...notDeletableImgs]
}
