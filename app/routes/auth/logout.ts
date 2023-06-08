import { Router } from 'express'
import ControllerAuth from '../../controllers/controller.auth'

const logoutRouters = Router()

logoutRouters.post('/login', ControllerAuth.login)

export default logoutRouters
