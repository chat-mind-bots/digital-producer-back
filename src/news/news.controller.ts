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
import { News, NewsCategory } from 'src/news/news.schema';
import { NewsService } from 'src/news/news.service';
import { RequestNewsCategoriesArrayType } from 'src/news/type/request-news-categories-array.type';
import { Public } from 'src/auth/public-route.decorator';
import { NewsCategoriesListGetQueryDto } from 'src/news/dto/query/news-categories-list-get-query.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { PatchNewsCategoryDto } from 'src/news/dto/patch-news-category.dto';
import { CreateNewsDto } from 'src/news/dto/create-news.dto';
import { NewsListGetQueryDto } from 'src/news/dto/query/news-list-get-query.dto';
import { RequestNewsArrayType } from 'src/news/type/request-news-array.type';
import { PatchNewsDto } from 'src/news/dto/patch-news.dto';

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

  @ApiOperation({ summary: 'Get news category by id' })
  @ApiResponse({ status: 200, type: NewsCategory })
  @Public()
  @UsePipes(MongoIdPipe)
  @Get('category/:id')
  async getNewsCategoryById(@Param('id') id: string) {
    return this.newsService.getNewsCategoryById(id);
  }

  @ApiOperation({ summary: 'Get news categories' })
  @ApiResponse({ status: 200, type: RequestNewsCategoriesArrayType })
  @Public()
  @Get('category')
  async getAllNewsCategory(@Query() query: NewsCategoriesListGetQueryDto) {
    return this.newsService.getAllNewsCategories(
      query.limit,
      query.offset,
      query.role,
    );
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

  @ApiOperation({ summary: 'Create news' })
  @ApiResponse({ status: 201, type: News })
  @Roles(UserRoleEnum.ADMIN)
  @Post()
  async createNews(@Body() dto: CreateNewsDto) {
    return this.newsService.createNews(dto);
  }

  @ApiOperation({ summary: 'Get news by id' })
  @ApiResponse({ status: 200, type: News })
  @Public()
  @UsePipes(MongoIdPipe)
  @Get(':id')
  async getNewsById(@Param('id') id: string) {
    return this.newsService.getNewsById(id);
  }

  @ApiOperation({ summary: 'Get news' })
  @ApiResponse({ status: 200, type: RequestNewsArrayType })
  @Public()
  @Get()
  async getAllNews(@Query() query: NewsListGetQueryDto) {
    return this.newsService.getNews(
      query.limit,
      query.offset,
      query['category-id'],
      query.role,
    );
  }

  @ApiOperation({ summary: 'Delete news' })
  @ApiResponse({ status: 200, type: News })
  @Roles(UserRoleEnum.ADMIN)
  @UsePipes(MongoIdPipe)
  @Delete(':id')
  async deleteNews(@Param('id') id: string) {
    return this.newsService.removeNews(id);
  }

  @ApiOperation({ summary: 'Change news' })
  @ApiResponse({ status: 201, type: News })
  @Roles(UserRoleEnum.ADMIN)
  @UsePipes(MongoIdPipe)
  @Patch(':id')
  async patchNews(@Param('id') id: string, @Body() dto: PatchNewsDto) {
    return this.newsService.changeNews(id, dto);
  }
}
