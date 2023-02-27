import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { type MusicEntity } from 'src/music/entities/music.entity'
import { MusicService } from 'src/music/music.service'
import { Repository } from 'typeorm'
import { VoteEntity } from './entities/vote.entity'

@Injectable()
export class VoteService {
  constructor (
    @InjectRepository(VoteEntity)
    private readonly voteRepository: Repository<VoteEntity>,
    private readonly musicService: MusicService
  ) {}

  @Cron('10 8 * * *')
  private async reset (): Promise<void> {
    await this.voteRepository.clear()
  }

  public async rank (): Promise<any> {
    const returns = await this.voteRepository
      .createQueryBuilder('vote')
      .select('vote.music_id')
      .addSelect('COUNT(*) AS rank')
      .leftJoinAndSelect('vote.music', 'music')
      .groupBy('vote.music_id')
      .orderBy('rank', 'DESC')
      .getRawMany()

    return returns
  }

  public async vote (userId: number, musicId: string): Promise<MusicEntity> {
    const alreadyVoted = await this.voteRepository.findOneBy({ userId })
    if (alreadyVoted) throw new ConflictException('이미 투표하셨습니다.')

    const music = await this.musicService.findOne(musicId)
    if (!music) throw new NotFoundException('해당 음악을 찾을 수 없습니다.')

    await this.voteRepository.insert({ userId, musicId })
    return music
  }
}
