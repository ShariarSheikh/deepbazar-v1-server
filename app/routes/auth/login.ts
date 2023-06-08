import { Router } from 'express'
import ControllerAuth from '../../controllers/controller.auth'

const loginRouters = Router()

loginRouters.post('/login', ControllerAuth.login)

export default loginRouters
