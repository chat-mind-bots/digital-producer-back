import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class BotService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {
    this.bot.telegram.setMyCommands([
      {
        command: 'start',
        description: 'Начало работы бота/получения последних обновлений',
      },
      { command: 'link', description: 'Получить ссылку для входа' },
    ]);
    //TODO wait update of telegraf to API 6.6
    // this.bot.telegram.setMyDescription('I am the bot');
  }

  async sendMessage(chatId: number, message: string, pinMessage: boolean) {
    await this.bot.telegram
      .sendMessage(chatId, message, { parse_mode: 'HTML' })
      .then((m) => {
        if (pinMessage) {
          this.bot.telegram.pinChatMessage(chatId, m.message_id);
        }
      });
    return;
  }
}
