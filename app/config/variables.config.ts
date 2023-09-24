export const PORT = process.env.PORT

export const environment = process.env.environment as string
export const localDbUrl = process.env.MONGODB_URI as string

export const secretTokenKey = process.env.tokenSecretkey

export const databaseConfig = {
  username: process.env.mongoDbUserName,
  password: process.env.mongoDbpassword,
  cluster: process.env.mongoDbcluster,
  dbName: process.env.mongoDbDatabaseName
}
