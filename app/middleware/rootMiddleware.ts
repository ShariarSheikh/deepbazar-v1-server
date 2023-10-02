import { environment } from '../config/variables.config'
import cors from 'cors'
import Express from 'express'

const jsonParser = Express.json()
const urlencoded = Express.urlencoded({ extended: true })

const allowOrigin = environment === 'development' ? 'http://localhost:3000' : 'https://deepbazar.vercel.app'
const corsUrl = cors({ origin: allowOrigin })

export default { jsonParser, urlencoded, corsUrl }
