import cors, { CorsOptions } from 'cors'
import Express from 'express'

const jsonParser = Express.json()
const urlencoded = Express.urlencoded({ extended: true })

const allowOrigins = ['http://localhost:4093', 'https://deepbazar.vercel.app']
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowOrigins.includes(origin)) {
      callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  }
}
const corsUrl = cors(corsOptions)

export default { jsonParser, urlencoded, corsUrl }
