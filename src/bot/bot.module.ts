import { forwardRef, Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import { BotUpdate } from 'src/bot/bot.update';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_API_KEY,
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  providers: [BotService, BotUpdate],
  controllers: [BotController],
  exports: [BotService],
})
export class BotModule {}
