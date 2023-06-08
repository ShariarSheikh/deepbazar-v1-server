import { NextFunction, Request, Response } from 'express'

export default class ControllerAuth {
  static register(req: Request, res: Response, next: NextFunction) {
    const users = ['User 1', 'User 2', 'User 3']
    res.json(users)
  }

  static login(req: Request, res: Response, next: NextFunction) {
    const users = ['User 1', 'User 2', 'User 3']
    res.json(users)
  }

  static logout(req: Request, res: Response, next: NextFunction) {
    const users = ['User 1', 'User 2', 'User 3']
    res.json(users)
  }
}
