import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { type Response } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  public canActivate (context: ExecutionContext): boolean {
    const response = context.switchToHttp().getResponse<Response>()
    if (response.locals?.id === undefined) {
      throw new UnauthorizedException('로그인되지 않았습니다.')
    }

    return true
  }
}
