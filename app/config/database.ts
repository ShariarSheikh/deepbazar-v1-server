import mongoose, { ConnectOptions } from 'mongoose'
import { databaseConfig } from './variables.config'

// DB variables
const dbUrl = `mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.cluster}.ebdrpdu.mongodb.net/${databaseConfig.dbName}?retryWrites=true&w=majority`
const dbOptions: ConnectOptions = {
  autoIndex: true
}

const connectDatabase = async () => {
  try {
    await mongoose.connect(dbUrl, dbOptions)
    console.log('Database connected')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}
export default connectDatabase
