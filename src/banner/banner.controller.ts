import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateBannerDto } from 'src/banner/dto/create-banner.dto';
import { Banner, BannerSchema } from 'src/banner/banner.schema';
import { JoiValidationPipe } from 'src/pipes/joi.pipe';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('banner')
@ApiTags('banner')
export class BannerController {
  @ApiOperation({ summary: 'Create new banner' })
  @ApiResponse({ status: 201, type: Banner })
  @Post()
  // async createBanner(@Body(new ValidationPipe()) dto: CreateBannerDto) {
  async createBanner(@Body() dto: CreateBannerDto) {
    return dto;
  }
}
