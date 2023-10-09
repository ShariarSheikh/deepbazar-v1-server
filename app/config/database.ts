import mongoose, { ConnectOptions } from 'mongoose'
import logger from '../core/Logger'
import { databaseConfig, environment, localDbUrl } from './variables.config'

// DB variables
const cloudDbUrl = `mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.cluster}.ebdrpdu.mongodb.net/${databaseConfig.dbName}?retryWrites=true&w=majority`
const dbOptions: ConnectOptions = {
  autoIndex: true
}

// const databaseUrl = environment === 'development' ? localDbUrl : cloudDbUrl
const databaseUrl = cloudDbUrl

const connectDatabase = async () => {
  try {
    await mongoose.connect(databaseUrl, dbOptions)
    logger.info(`Database connected with ${environment === 'development' ? 'local database' : 'cloud database'}`)
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error)
  }
}
export default connectDatabase
