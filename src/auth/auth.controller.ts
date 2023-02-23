import { Controller, Get, Query, Redirect, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService
  ) {}

  @Get('/login')
  @Redirect()
  public login (): any {
    const loginUri = this.authService.login()
    return { url: loginUri, statusCode: 302 }
  }

  @Get('/callback')
  @Redirect('/', 301)
  public async callback (
    @Query('state') state: string,
      @Query('id_token') token: string,
      @Res() res: Response
  ): Promise<void> {
    const signedToken = await this.authService.callback(state, token)
    res.setHeader('Set-Cookie', `token=${signedToken}; path=/; httpOnly;`)
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  public me (@Res({ passthrough: true }) res: Response): string {
    return res.locals.id
  }
}
