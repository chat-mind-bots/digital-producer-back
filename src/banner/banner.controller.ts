import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBannerDto } from 'src/banner/dto/create-banner.dto';
import { Banner } from 'src/banner/banner.schema';
import { BannerService } from 'src/banner/banner.service';
import { BannerGetQueryDto } from 'src/banner/dto/query/banner-get-query.dto';
import { PatchBannerDto } from 'src/banner/dto/patch-banner.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { RequestArrayType } from 'src/banner/types/request-array.type';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

@Controller('banner')
@ApiTags('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}
  @ApiOperation({ summary: 'Create new banner' })
  @ApiResponse({ status: 201, type: Banner })
  @Roles(UserRoleEnum.ADMIN)
  @Post()
  async createBanner(@Body() dto: CreateBannerDto) {
    return this.bannerService.createBanner(dto);
  }

  @ApiOperation({ summary: 'Get banners list' })
  @ApiResponse({ status: 200, type: RequestArrayType })
  @Get()
  async getBanners(@Query() query: BannerGetQueryDto) {
    const { limit, offset, type, role } = query;
    return this.bannerService.getBanners(limit, offset, type, role);
  }

  @ApiOperation({ summary: 'Get banner by id' })
  @ApiResponse({ status: 200, type: Banner })
  @UsePipes(MongoIdPipe)
  @Get(':id')
  async getBanner(@Param('id') id: string) {
    return this.bannerService.getBannerById(id);
  }

  @ApiOperation({ summary: `Change banner's fields by banner id` })
  @ApiResponse({ status: 200, type: Banner })
  @UsePipes(MongoIdPipe)
  @Roles(UserRoleEnum.ADMIN)
  @Patch(':id')
  async patchBanner(@Param('id') id: string, @Body() dto: PatchBannerDto) {
    return this.bannerService.changeBanner(id, dto);
  }

  @ApiOperation({ summary: `Delete banner by id` })
  @ApiResponse({ status: 200, type: Banner })
  @UsePipes(MongoIdPipe)
  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  async deleteBanner(@Param('id') id: string) {
    return this.bannerService.deleteBanner(id);
  }
}
