import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomBytes } from 'crypto'
import * as jwt from 'jsonwebtoken'
import axios from 'axios'
import { type Token } from 'src/interface/Token'

@Injectable()
export class AuthService {
  private readonly nonces: Map<string, string>
  constructor (
    private readonly configService: ConfigService
  ) {
    this.nonces = new Map()
  }

  public login (): string {
    const nonce = randomBytes(10).toString('hex')
    const state = randomBytes(10).toString('hex')

    this.nonces.set(state, nonce)
    setInterval(() => this.nonces.delete(state), 60 * 1000)

    const CLIENT_ID = this.configService.get<string>('CLIENT_ID', '')
    const REDIRECT_URI = this.configService.get<string>('REDIRECT_URI', '')

    return 'https://center.gbsw.hs.kr/login' +
      `?client_id=${CLIENT_ID}` +
      `&redirect_uri=${REDIRECT_URI}` +
      '&scope=openid' +
      `&state=${state}` +
      `&nonce=${nonce}` +
      '&response_type=id_token'
  }

  public async callback (state: string, token: string): Promise<string> {
    if (!this.nonces.has(state)) throw new ForbiddenException('위변조된 토큰입니다.')

    const PUBKEY_URL = this.configService.get<string>('PUBKEY_URL', '')
    const pubkey = await axios({ method: 'GET', url: PUBKEY_URL })

    const nonce = this.nonces.get(state)
    this.nonces.delete(state)

    try {
      const CLIENT_ID = this.configService.get<string>('CLIENT_ID', '')
      const ISSUER = this.configService.get<string>('ISSUER', '')

      const verified = jwt.verify(token, pubkey.data, {
        algorithms: ['ES256'],
        audience: CLIENT_ID,
        issuer: ISSUER,
        nonce
      }) as any
      const { nickname, id } = verified.data

      const JWT_SECRET = this.configService.get<string>('JWT_SECRET', '')
      return jwt.sign({ id, nickname }, JWT_SECRET, {
        algorithm: 'HS256',
        issuer: 'https://music.gbsw.hs.kr',
        expiresIn: '30m'
      })
    } catch (e) {
      throw new ForbiddenException('만료된 로그인이거나 위변조된 로그인입니다.')
    }
  }

  public verifyToken (token: string): Token {
    try {
      const JWT_SECRET = this.configService.get<string>('JWT_SECRET', '')
      return jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: 'https://music.gbsw.hs.kr'
      }) as Token
    } catch (e) {
      return null
    }
  }
}
