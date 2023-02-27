import { Ctx, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { forwardRef, Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { Public } from 'src/auth/public-route.decorator';
import { isPrivate } from 'src/bot/bot.utils';
import { AuthService } from 'src/auth/auth.service';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Start()
  async startCommand(ctx: Context) {
    if (ctx.chat.type !== 'private') {
      return;
    }
    const oldUser = await this.userService.findByTGId(ctx.from.id);
    if (oldUser) {
      await ctx.sendMessage(`Hi, ${oldUser.first_name}`, {
        reply_markup: {
          keyboard: [[{ text: 'Получить токен' }]],
        },
      });
      return;
    }
    const info = await ctx.getChat();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { id: tg_id, photo, username, first_name, type } = info;
    const getPhotos = async (smallPath?: string, bigPath?: string) => {
      if (!smallPath && !bigPath) {
        return undefined;
      }
      const small = await ctx.telegram.getFileLink(smallPath);
      const big = await ctx.telegram.getFileLink(bigPath);
      return {
        small,
        big,
      };
    };
    const photos = await getPhotos(photo?.small_file_id, photo?.big_file_id);

    const user = await this.userService.createUser({
      tg_id,
      role: [UserRoleEnum.USER],
      username,
      first_name,
      type,
      photos,
    });
    await ctx.sendMessage(`Hi, ${user.first_name}, your role is ${user.role}`, {
      reply_markup: {
        keyboard: [[{ text: 'Получить токен' }]],
      },
    });
    return;
  }

  @Public()
  @On('message')
  async messageHandler(@Message('text') msg: string, @Ctx() ctx: Context) {
    if (!isPrivate(ctx.chat.type)) {
      return;
    }
    const { from } = ctx.message;
    if (msg === 'Получить токен') {
      const user = await this.userService.findByTGId(from.id);
      const { access_token } = await this.authService.login(
        user.first_name,
        user.tg_id,
        user.role,
      );
      const href = `${process.env.FRONT_URL}/auth/${access_token}`;
      await ctx.reply(
        `Ваша ссылка для входа: ${process.env.MODE === 'DEVELOP' ? href : ''}`,
        process.env.MODE !== 'DEVELOP'
          ? Markup.inlineKeyboard([Markup.button.url(href, href)])
          : {},
      );
    }
    return;
  }
}
