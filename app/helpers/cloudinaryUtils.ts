import cloudinary from 'cloudinary'

interface UploadProfileImgProps {
  filePath: string
  fileName: string
  folder: 'userprofilePictures' | 'productPictures'
}

export async function uploadImgToCloudinary({ filePath, fileName, folder }: UploadProfileImgProps) {
  return await cloudinary.v2.uploader.upload(filePath, {
    resource_type: 'image',
    public_id: `deepbazar/${folder}/${fileName}`
  })
}

// IMAGE DELETE FUNCTION-------------------------------------------

export async function deleteImgFromCloudinary(publicId: string) {
  return await cloudinary.v2.uploader.destroy(publicId)
}
