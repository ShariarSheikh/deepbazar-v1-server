import multer from 'multer'
import fs from 'fs'

export const fileFolderPath = './uploads/'

if (!fs.existsSync(fileFolderPath)) {
  fs.mkdirSync(fileFolderPath)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fileFolderPath)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '--' + file.originalname)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB
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
