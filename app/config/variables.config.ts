export const PORT = process.env.PORT
export const environment = process.env.environment as string

// jwt key
export const SECRET_ACCESS_TOKEN_KEY = process.env.secretAccessKey as string
export const SECRET_REFRESH_TOKEN_KEY = process.env.secretRefreshKey as string

export const serverAccessApiKey = process.env.ApiKey as string

//--------------------------------------------database
export const localDbUrl = process.env.MONGODB_URI as string
export const databaseConfig = {
  username: process.env.mongoDbUserName,
  password: process.env.mongoDbpassword,
  cluster: process.env.mongoDbcluster,
  dbName: process.env.mongoDbDatabaseName
}

//----------------------------------------------- image cloudinary
export const cloudinaryConfig = {
  cloud_name: process.env.cloud_name as string,
  api_key: process.env.api_key as string,
  api_secret: process.env.api_secret as string
}
export const cloudinaryProfileImgFolder = process.env.cloudinaryProfileImgFolder as string
export const cloudinaryProductImgFolder = process.env.cloudinaryProductImgFolder as string

// nodemailer & brevo email service envs
export const nodeMailer = {
  host: process.env.NODE_MAILER_HOST as string,
  port: process.env.NODE_MAILER_PORT,
  user: process.env.NODE_MAILER_USER as string,
  pass: process.env.NODE_MAILER_PASS as string,
  senderEmail: process.env.NODE_MAILER_EMAIL_SENDER_EMAIL as string,
  emailVerifiedSecretKey: process.env.VERIFICATION_EMAIL_SECRET_KEY as string,
  resetPasswordSecretKey: process.env.RESET_PASSWORD_SECRET_KEY as string
}

export const websiteURls = {
  dev: process.env.SITE_DEV_URL,
  prod: process.env.SITE_PROD_URL
}
