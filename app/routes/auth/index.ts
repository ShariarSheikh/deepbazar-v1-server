import loginRouters from './login'
import logoutRouters from './logout'
import registerRouters from './register'
import tokenRouters from './token'

const authRouters = { registerRouters, loginRouters, logoutRouters, tokenRouters }

export default authRouters
