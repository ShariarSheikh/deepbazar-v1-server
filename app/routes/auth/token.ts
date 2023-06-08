import { Router } from 'express'
import ControllerAuth from '../../controllers/controller.auth'

const tokenRouters = Router()

tokenRouters.post('/login', ControllerAuth.login)

export default tokenRouters
