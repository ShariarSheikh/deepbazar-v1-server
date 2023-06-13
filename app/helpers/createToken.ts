import JsonWebToken from 'jsonwebtoken'
import { secretTokenKey } from '../config/variables.config'

//----------------------------------------------
interface IProps {
  userName: string
  email: string
}
//----------------------------------------------

const secretKey = secretTokenKey as string
export default (props: IProps): string => {
  const { userName, email } = props
  return JsonWebToken.sign({ userName, email }, secretKey)
}
