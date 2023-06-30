import { Controller, Get } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public-route.decorator';

@Controller('config')
@ApiTags('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @ApiOperation({ summary: 'Get config' })
  @Public()
  @Get()
  async getConfig() {
    return this.configService.getConfig();
  }
}
