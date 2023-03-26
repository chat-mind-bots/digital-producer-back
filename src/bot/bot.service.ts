import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BotService {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
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

  async getChatInfo(tg_id: number) {
    const info = await this.bot.telegram.getChat(tg_id);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { photo, username, first_name, type } = info;

    const getPhotos = async (smallPath?: string, bigPath?: string) => {
      if (!smallPath && !bigPath) {
        return undefined;
      }
      const small = await this.bot.telegram.getFileLink(smallPath);
      const big = await this.bot.telegram.getFileLink(bigPath);
      return {
        small,
        big,
      };
    };
    const photos = await getPhotos(photo?.small_file_id, photo?.big_file_id);
    return {
      first_name,
      type,
      photos,
      username,
    };
  }
}
