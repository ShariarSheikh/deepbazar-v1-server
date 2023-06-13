export const PORT = 8000

export const environment = process.env.environment

export const secretTokenKey = process.env.tokenSecretkey

export const databaseConfig = {
  username: process.env.mongoDbUserName,
  password: process.env.mongoDbpassword,
  cluster: process.env.mongoDbcluster,
  dbName: process.env.mongoDbDatabaseName
}
