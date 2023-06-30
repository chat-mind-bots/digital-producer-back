import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BotService } from 'src/bot/bot.service';

@Controller('bot')
@ApiTags('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}
}
