import { Controller, Get } from '@nestjs/common'
import { VoteService } from './vote.service'

@Controller('vote')
export class VoteController {
  constructor (
    private readonly voteService: VoteService
  ) {}

  @Get('/')
  public async rank (): Promise<any> {
    const ranks = await this.voteService.rank()
    return ranks
  }
}
