import Express from 'express'
import rootMiddleware from './middleware/rootMiddleware'
import router from './routes'
import connectDatabase, { connectToCloudinary } from './config/database'
import { GlobalErrorHandler, NotFoundRouteErrorHandler } from './core/ErrorHandler'

const app = Express()

// Database connect
connectDatabase()
connectToCloudinary()

//Middleware
app.use(rootMiddleware.jsonParser, rootMiddleware.urlencoded, rootMiddleware.corsUrl)
//ROUTER
app.use(router)

//Error handler
app.all('*', NotFoundRouteErrorHandler)
app.use(GlobalErrorHandler)

export default app
