import { Router } from 'express'
import ControllerAuth from '../../controllers/controller.auth'

const registerRouters = Router()

registerRouters.post('/login', ControllerAuth.login)

export default registerRouters
