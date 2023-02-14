import { forwardRef, Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NewsCategory,
  News,
  NewsSchema,
  NewsCategorySchema,
} from 'src/news/news.schema';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsCategory.name, schema: NewsCategorySchema },
      { name: News.name, schema: NewsSchema },
    ]),
    forwardRef(() => TagsModule),
  ],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
