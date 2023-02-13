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
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { CreateNewsCategoryDto } from 'src/news/dto/create-news-category.dto';
import { NewsCategory } from 'src/news/news.schema';
import { NewsService } from 'src/news/news.service';
import { RequestNewsCategoriesArrayType } from 'src/news/news/reques-news-categories-array.type';
import { Public } from 'src/auth/public-route.decorator';
import { NewsCategoriesListGetQueryDto } from 'src/news/dto/query/news-categories-list-get-query.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { PatchNewsCategoryDto } from 'src/news/dto/patch-news-category.dto';

@Controller('news')
@ApiTags('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @ApiOperation({ summary: 'Create news category' })
  @ApiResponse({ status: 201, type: NewsCategory })
  @Roles(UserRoleEnum.ADMIN)
  @Post('category')
  async createNewsCategory(@Body() dto: CreateNewsCategoryDto) {
    return this.newsService.creatNewsCategory(dto);
  }

  @ApiOperation({ summary: 'Get news categories' })
  @ApiResponse({ status: 200, type: RequestNewsCategoriesArrayType })
  @Public()
  @Get('category')
  async getNewsCategory(@Query() query: NewsCategoriesListGetQueryDto) {
    return this.newsService.getAllNewsCategories(query.limit, query.offset);
  }

  @ApiOperation({ summary: 'Delete news category' })
  @ApiResponse({ status: 200, type: NewsCategory })
  @Roles(UserRoleEnum.ADMIN)
  @UsePipes(MongoIdPipe)
  @Delete('category/:id')
  async deleteNewsCategory(@Param('id') id: string) {
    return this.newsService.removeNewsCategory(id);
  }

  @ApiOperation({ summary: 'Change news category' })
  @ApiResponse({ status: 201, type: NewsCategory })
  @Roles(UserRoleEnum.ADMIN)
  @UsePipes(MongoIdPipe)
  @Patch('category/:id')
  async patchNewsCategory(
    @Param('id') id: string,
    @Body() dto: PatchNewsCategoryDto,
  ) {
    return this.newsService.changeNewsCategory(id, dto);
  }
}
