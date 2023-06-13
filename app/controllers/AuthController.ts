import AuthModel from '../models/Auth.Model'

interface UserRegisterData {
  email: string
  password: string
  name: string
  profileImageUrl: string
}

interface LoginPropsData {
  email: string
  password: string
}

class AuthController {
  public async findUserWithEmail(email: string) {
    return await AuthModel.findOne({ email })
  }

  public async login({ email, password }: LoginPropsData) {
    return await AuthModel.findOne({ email })
  }

  public async createUser(body: UserRegisterData) {
    const { name, email, password, profileImageUrl } = body
    return await AuthModel.create({ name, email, password, profileImageUrl })
  }
}

export default new AuthController()
