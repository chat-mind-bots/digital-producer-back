import { InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { forwardRef, Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    const oldUser = await this.userService.findByTGId(ctx.from.id);
    if (oldUser) {
      await ctx.sendMessage(
        `Hi, ${oldUser.first_name}, your role is ${oldUser.role}`,
      );
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
    await ctx.sendMessage(`Hi, ${user.first_name}, your role is ${user.role}`);
    return;
  }
}
