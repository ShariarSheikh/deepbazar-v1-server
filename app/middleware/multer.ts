import multer from 'multer'
import fs from 'fs'

export const fileUploadFolderPath = '/tmp/'

if (!fs.existsSync(fileUploadFolderPath)) {
  fs.mkdirSync(fileUploadFolderPath)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fileUploadFolderPath)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '--' + file.originalname)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedFileExtensions = ['.svg', '.png', '.jpeg', '.webp', '.jpg']

    const fileExtension = '.' + file.originalname.split('.').pop()
    if (allowedFileExtensions.includes(fileExtension)) {
      cb(null, true)
    } else {
      cb(new Error('Only .svg, .png, .jpeg, .webp, and .jpg files are allowed.'))
    }
  }
})

export default upload
