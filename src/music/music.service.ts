import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import * as yts from 'yt-search'
import { type Music } from 'src/interface/Music'
import { InjectRepository } from '@nestjs/typeorm'
import { MusicEntity } from './entities/music.entity'
import { Repository } from 'typeorm'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class MusicService {
  constructor (
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>
  ) {}

  @Cron('10 8 * * *')
  private async reset (): Promise<void> {
    await this.musicRepository.clear()
  }

  public async getAll (): Promise<MusicEntity[]> {
    return await this.musicRepository.find()
  }

  public async findOne (musicId: string): Promise<MusicEntity | null> {
    return await this.musicRepository.findOneBy({ id: musicId })
  }

  public async search (query: string): Promise<Music[]> {
    const result = await yts(query + ' topic')
    return result.videos as Music[]
  }

  public async add (userId: string, musicId: string): Promise<Music> {
    const result = await yts(musicId)
    const targetVideo = result.videos[0]
    if (!targetVideo) throw new NotFoundException('해당 노래를 찾을 수 없습니다.')

    const userExist = await this.musicRepository.findOneBy({ registrant: userId })
    if (userExist) throw new ConflictException('이미 노래를 등록한 사용자 입니다.')

    const musicExist = await this.musicRepository.findOneBy({ id: musicId })
    if (musicExist) throw new ConflictException('이미 있는 노래입니다.')

    const { videoId: id, url, title, thumbnail, timestamp, author } = targetVideo
    await this.musicRepository.insert({
      id,
      registrant: userId,
      url,
      title,
      thumbnail,
      timestamp,
      artist: author.name
    })

    return {
      videoId: id,
      url,
      title,
      thumbnail,
      timestamp,
      author
    }
  }
}
