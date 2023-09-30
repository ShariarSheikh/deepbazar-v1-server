import { RoleType } from '../models/Auth.Model'
import { NextFunction, Request, Response, Router } from 'express'

export default (...roles: RoleType[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    req.accessibleRoles = roles
    next()
  }
