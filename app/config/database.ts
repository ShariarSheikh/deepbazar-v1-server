import mongoose, { ConnectOptions } from 'mongoose'
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
    console.log(`Database connected with ${environment === 'development' ? 'local database' : 'cloud database'}`)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}
export default connectDatabase
