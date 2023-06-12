import { NextFunction, Request, Response } from 'express'

export default class ControllerProduct {
  static list(req: Request, res: Response, next: NextFunction) {
    const users = ['User 1', 'User 2', 'User 3']
    res.json(users)
  }

  static details(req: Request, res: Response, next: NextFunction) {
    const users = ['User 1', 'User 2', 'User 3']
    res.json(users)
  }

  static search(req: Request, res: Response, next: NextFunction) {
    const users = ['User 1', 'User 2', 'User 3']
    res.json(users)
  }

  static create(req: Request, res: Response, next: NextFunction) {
    const users = ['User 1', 'User 2', 'User 3']
    res.json(users)
  }

  static update(req: Request, res: Response, next: NextFunction) {
    const users = ['User 1', 'User 2', 'User 3']
    res.json(users)
  }

  static delete(req: Request, res: Response, next: NextFunction) {
    const users = ['User 1', 'User 2', 'User 3']
    res.json(users)
  }
}
