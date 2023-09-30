import Joi from 'joi'
import { JoiAuthBearer } from '../routes/auth/schema'

export default {
  apiKey: Joi.object()
    .keys({
      ['x-api-key']: Joi.string().required()
    })
    .unknown(true),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required()
    })
    .unknown(true)
}
