import { ProductImageType } from '../models/Product.Model'
import { deleteImgFromCloudinary, uploadProductImages } from './cloudinaryUtils'

interface UpdateProfileImageHandlerProps {
  productImgInDatabase: ProductImageType[]
  imagesLinks: ProductImageType[]
  files: Express.Multer.File[]
}

export default async function updateProfileImageHandler({
  imagesLinks,
  productImgInDatabase,
  files
}: UpdateProfileImageHandlerProps) {
  const deletableImgs: string[] = []
  const notDeletableImgs: ProductImageType[] = []
  let newImages: ProductImageType[] = []

  // THE CONDITION IS: CHECK THE PRODUCT DATABASE IMAGES,
  // AND THEN CHECK THE UPDATED REQUEST BODY IMAGES LIST,
  // IF DATABASE IMAGE DOSE'T EXIT IN BODY THEN REMOVE DATABASE IMAGES

  // if exits previews img of product
  if (imagesLinks?.length > 0) {
    productImgInDatabase.forEach((imgFromDatabase) => {
      imagesLinks?.forEach((imgFromBody) => {
        //FILTER DELETE-ABLE
        if (imgFromDatabase.publicId !== imgFromBody.publicId) {
          const isAlreadyPushThisImgToDeleteAbleList = deletableImgs.find(
            (deletableImg) => deletableImg === imgFromDatabase.publicId
          )
          if (isAlreadyPushThisImgToDeleteAbleList) return

          deletableImgs.push(imgFromDatabase.publicId)
        }

        //NOT DELETE-ABLE
        if (imgFromDatabase.publicId === imgFromBody.publicId) notDeletableImgs.push(imgFromDatabase)
      })
    })
  } else if (files?.length && !imagesLinks?.length) {
    productImgInDatabase.forEach((imgData) => {
      deletableImgs.push(imgData.publicId)
    })
  }

  // REMOVE
  deletableImgs.forEach((deleteAbleImgPublicId) => {
    deleteImgFromCloudinary(deleteAbleImgPublicId)
  })

  // IF FILES EXITS IN REQUEST THEN UPDATE
  if (files?.length) {
    const images = await uploadProductImages({ files: files })
    newImages = [...images]
  }

  return [...newImages, ...notDeletableImgs]
}
