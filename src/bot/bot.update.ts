import {InjectBot, Start, Update} from "nestjs-telegraf";
import {Context, Telegraf} from "telegraf";

@Update()
export class BotUpdate {
    constructor( @InjectBot() private readonly bot: Telegraf<Context>,) {}

    @Start()
    async startCommand(ctx: Context) {
        await ctx.sendMessage('Hi!')
        return;
    }
}
