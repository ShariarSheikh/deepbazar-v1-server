import cloudinary from 'cloudinary'
import { cloudinaryProductImgFolder, cloudinaryProfileImgFolder } from '../config/variables.config'
import removeImgFile from './removeImgFile'
import { fileUploadFolderPath } from '../middleware/multer'
import { ProductImageType } from '../models/Product.Model'

//--------------------------------------
interface UploadProductImages {
  files: Express.Multer.File[]
}

export async function uploadProductImages({ files }: UploadProductImages): Promise<ProductImageType[]> {
  const images = []

  // upload
  for (const file of files) {
    const filePath = `${fileUploadFolderPath}/${file?.filename}`

    const imageData = await cloudinary.v2.uploader.upload(filePath, {
      eager_async: true,
      eager: productImageSizes(),
      resource_type: 'image',
      public_id: `${cloudinaryProductImgFolder}/${file.filename}`
    })

    // remove form local tmp file
    await removeImgFile(filePath)

    // push to images array
    images.push({
      isDefault: images.length === 0 ? true : false,
      defaultImg: imageData.url,
      publicId: imageData.public_id,
      //
      displayImg: imageData.eager[0].url,
      cardImg: imageData.eager[1].url,
      commentImg: imageData.eager[2].url,
      smallImg: imageData.eager[3].url
    })
  }

  return images
}

//--------------------------------

interface UploadProfileImg {
  file: Express.Multer.File
}

interface UploadProfileImgReturn {
  imgUrl: string
  publicId: string
}

export async function uploadProfileImg({ file }: UploadProfileImg): Promise<UploadProfileImgReturn> {
  const filePath = `${fileUploadFolderPath}/${file?.filename}`

  const imgData = await cloudinary.v2.uploader.upload(filePath, {
    eager_async: true,
    eager: profileImageSize(),
    resource_type: 'image',
    public_id: `${cloudinaryProfileImgFolder}/${file.filename}`
  })
  await removeImgFile(filePath)

  return { imgUrl: imgData.eager[0].url, publicId: imgData.public_id }
}

// IMAGE DELETE FUNCTION-------------------------------------------

export async function deleteImgFromCloudinary(publicId: string) {
  return await cloudinary.v2.uploader.destroy(publicId)
}

// IMAGE CUSTOMIZATION SIZE FUNCTION----------------------
interface IReturn {
  width: number
  height: number
  format: string
}

function productImageSizes(): IReturn[] {
  return [
    { width: 450, height: 450, format: 'webp' }, // details page image
    { width: 300, height: 300, format: 'webp' }, // card image
    { width: 75, height: 75, format: 'webp' }, // card small
    { width: 40, height: 40, format: 'webp' } // comment
  ]
}

function profileImageSize(): IReturn[] {
  return [{ width: 120, height: 120, format: 'webp' }]
}
