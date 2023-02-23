import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common'
import { ResolveTokenMiddleware } from './auth/auth.middleware'
import { AuthModule } from './auth/auth.module'
import { MusicModule } from './music/music.module';

@Module({
  imports: [
    AuthModule,
    MusicModule
  ]
})
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(ResolveTokenMiddleware)
      .forRoutes('*')
  }
}
