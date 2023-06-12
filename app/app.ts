import Express from 'express'
import connectDatabase from './config/database'
import { GlobalErrorHandler, NotFoundRouteErrorHandler } from './core/ErrorHandler'
import rootMiddleware from './middleware/rootMiddleware'
import router from './routes'

const app = Express()

// Database connect
connectDatabase()

//Middleware
app.use(rootMiddleware.jsonParser, rootMiddleware.urlencoded)
//ROUTER
app.use(router)

//Error handler
app.all('*', NotFoundRouteErrorHandler)
app.use(GlobalErrorHandler)

export default app
