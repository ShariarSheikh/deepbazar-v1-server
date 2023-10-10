import mongoose, { ConnectOptions } from 'mongoose'
import cloudinary from 'cloudinary'
import logger from '../core/Logger'
import { cloudinaryConfig, databaseConfig, environment, localDbUrl } from './variables.config'

// DB variables
const cloudDbUrl = `mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.cluster}.ebdrpdu.mongodb.net/${databaseConfig.dbName}?retryWrites=true&w=majority`
const dbOptions: ConnectOptions = {
  autoIndex: true
}

const databaseUrl = environment === 'development' ? localDbUrl : cloudDbUrl
// const databaseUrl = cloudDbUrl

const connectDatabase = async () => {
  try {
    await mongoose.connect(databaseUrl, dbOptions)
    logger.info(`Database connected with ${environment === 'development' ? 'local database' : 'cloud database'}`)
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error)
  }
}

export default connectDatabase

// CLOUDINARY DATABASE CONFIG
export function connectToCloudinary() {
  return cloudinary.v2.config({
    cloud_name: cloudinaryConfig.cloud_name,
    api_key: cloudinaryConfig.api_key,
    api_secret: cloudinaryConfig.api_secret,
    secure: true
  })
}
