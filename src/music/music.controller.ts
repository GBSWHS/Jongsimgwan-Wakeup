import { BadRequestException, Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common'
import { type ResponseBody } from 'src/interface/ResponseBody'
import { type Music } from 'src/interface/Music'
import { MusicService } from './music.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { Response } from 'express'
import { type MusicEntity } from './entities/music.entity'

@Controller('music')
export class MusicController {
  constructor (
    private readonly musicService: MusicService
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
  public async getAll (): Promise<ResponseBody<MusicEntity[]>> {
    return {
      success: true,
      body: await this.musicService.getAll()
    }
  }

  @Get('/search')
  @UseGuards(AuthGuard)
  public async search (@Query('q') query): Promise<ResponseBody<Music[]>> {
    if (!query) throw new BadRequestException()
    const musicList = await this.musicService.search(query)

    return {
      success: true,
      body: musicList
    }
  }

  @Post('/')
  @UseGuards(AuthGuard)
  public async add (@Body('id') musicId: string, @Res({ passthrough: true }) res: Response): Promise<ResponseBody<Music>> {
    if (!musicId) throw new BadRequestException()
    const addResult = await this.musicService.add(res.locals.id, musicId)

    return {
      success: true,
      body: addResult
    }
  }
}
