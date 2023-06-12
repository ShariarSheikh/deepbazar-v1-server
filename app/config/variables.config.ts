export const PORT = 8000

export const environment = process.env.NODE_ENV

export const databaseConfig = {
  username: process.env.mongoDbUserName,
  password: process.env.mongoDbpassword,
  cluster: process.env.mongoDbcluster,
  dbName: process.env.mongoDbDatabaseName
}
