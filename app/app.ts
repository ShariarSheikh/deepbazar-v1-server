import Express from 'express'
import router from './routes'

const app = Express()

//ROUTER
app.use(router)

export default app
