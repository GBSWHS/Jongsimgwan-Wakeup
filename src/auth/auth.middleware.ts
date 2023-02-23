import { Injectable, type NestMiddleware } from '@nestjs/common'
import { type NextFunction, type Request, type Response } from 'express'
import { AuthService } from './auth.service'

@Injectable()
export class ResolveTokenMiddleware implements NestMiddleware {
  constructor (
    private readonly authService: AuthService
  ) {}

  public use (req: Request, res: Response, next: NextFunction): void {
    const { token } = req.cookies
    res.locals = this.authService.verifyToken(token)

    next()
  }
}
