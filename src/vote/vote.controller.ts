import { Body, Controller, Get, Post, UseGuards, Res, BadRequestException } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { VoteService } from './vote.service'
import { Response } from 'express'

@Controller('vote')
export class VoteController {
  constructor (
    private readonly voteService: VoteService
  ) {}

  @UseGuards(AuthGuard)
  @Post('/')
  public async vote (@Body('musicId') musicId: string, @Res({ passthrough: true }) res: Response) {
    if (!musicId) throw new BadRequestException()
    const vote = await this.voteService.vote(res.locals.id, musicId)
    return {
      success: true,
      body: vote
    }
  }

  @Get('/')
  public async rank (): Promise<any> {
    const ranks = await this.voteService.rank()
    return {
      success: true,
      body: ranks
    }
  }
}
