export const PORT = process.env.PORT

export const environment = process.env.environment as string
export const localDbUrl = process.env.MONGODB_URI as string

export const SECRET_ACCESS_TOKEN_KEY = process.env.secretAccessKey as string
export const SECRET_REFRESH_TOKEN_KEY = process.env.secretRefreshKey as string

export const databaseConfig = {
  username: process.env.mongoDbUserName,
  password: process.env.mongoDbpassword,
  cluster: process.env.mongoDbcluster,
  dbName: process.env.mongoDbDatabaseName
}

export const serverAccessApiKey = process.env.ApiKey as string
