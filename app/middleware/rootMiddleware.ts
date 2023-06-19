import cors from 'cors'
import Express from 'express'

const jsonParser = Express.json()
const urlencoded = Express.urlencoded({ extended: true })

const corsOptions = {
  origin: ['https://deepbazar.vercel.app/', 'http://localhost:4093/'],
  optionsSuccessStatus: 200
}
const corsUrl = cors(corsOptions)

export default { jsonParser, urlencoded, corsUrl }
