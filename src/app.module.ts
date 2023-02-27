import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ResolveTokenMiddleware } from './auth/auth.middleware'
import { AuthModule } from './auth/auth.module'
import { MusicModule } from './music/music.module'
import { VoteModule } from './vote/vote.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: '127.0.0.1',
      port: 3306,
      username: 'wakeup',
      database: 'wakeup',
      entities: ['./dist/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    MusicModule,
    VoteModule
  ]
})
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(ResolveTokenMiddleware)
      .forRoutes('*')
  }
}
