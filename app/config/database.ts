import mongoose, { ConnectOptions } from 'mongoose'
import logger from '../core/Logger'
import { databaseConfig, environment } from './variables.config'

// DB variables
const localDbUrl = `mongodb://localhost:27017`
const cloudDbUrl = `mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.cluster}.ebdrpdu.mongodb.net/${databaseConfig.dbName}?retryWrites=true&w=majority`
const dbOptions: ConnectOptions = {
  autoIndex: true
}

const databaseUrl = environment === 'development' ? localDbUrl : cloudDbUrl

const connectDatabase = async () => {
  try {
    await mongoose.connect(databaseUrl, dbOptions)
    logger.info(`Database connected with ${environment === 'development' ? 'local database' : 'cloud database'}`)
  } catch (error) {
    logger.info('Error connecting to MongoDB:', error)
  }
}
export default connectDatabase
