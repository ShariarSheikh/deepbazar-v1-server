import AuthModel, { IAuth } from '../models/Auth.Model'

interface LoginPropsData {
  email: string
  password: string
}

class AuthController {
  public async findUserWithEmail(email: string): Promise<IAuth | null> {
    return await AuthModel.findOne({ email })
  }
  public async createUser(user: IAuth) {
    return await AuthModel.create(user)
  }
}

export default new AuthController()
