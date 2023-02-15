import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateNewsCategoryDto } from 'src/news/dto/create-news-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  NewsCategory,
  NewsCategoryDocument,
  News,
  NewsDocument,
} from 'src/news/news.schema';
import { Model, Types } from 'mongoose';
import { TagsService } from 'src/tags/tags.service';
import { PatchNewsCategoryDto } from 'src/news/dto/patch-news-category.dto';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { CreateNewsDto } from 'src/news/dto/create-news.dto';
import { PatchNewsDto } from 'src/news/dto/patch-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(NewsCategory.name)
    private readonly newsCategoriesModel: Model<NewsCategoryDocument>,
    @InjectModel(News.name)
    private readonly newsModel: Model<NewsDocument>,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
  ) {}

  async getNewsCategoryById(id: string) {
    const newsCategory = await this.newsCategoriesModel.findById(id);
    if (!newsCategory) {
      throw new HttpException(
        'Document (News Category) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return newsCategory;
  }
  async creatNewsCategory(dto: CreateNewsCategoryDto) {
    const newsCategory = await this.newsCategoriesModel.create({
      ...dto,
      list: [],
    });

    return this.getNewsCategoryById(newsCategory._id);
  }

  async getAllNewsCategories(
    limit: number,
    offset: number,
    userRole?: UserRoleEnum,
  ) {
    const filters = {};
    if (userRole) {
      filters['role'] = userRole;
    }

    const newsCategories = await this.newsCategoriesModel
      .find({ ...filters })
      .limit(limit)
      .skip(offset)
      .exec();
    const total = await this.newsCategoriesModel
      .countDocuments({ ...filters })
      .exec();
    return {
      data: newsCategories,
      total,
    };
  }

  async changeNewsCategory(id: string, dto: PatchNewsCategoryDto) {
    const newsCategory = await this.getNewsCategoryById(id);
    await newsCategory.updateOne({ ...dto });

    return this.getNewsCategoryById(id);
  }

  async removeNewsCategory(id: string) {
    const result = this.newsCategoriesModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpException(
        'Document (News category) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }

  async getNewsById(id: string) {
    const news = await this.newsModel.findById(id).populate('tags');
    if (!news) {
      throw new HttpException(
        'Document (News) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return news;
  }

  async getNews(
    limit: number,
    offset: number,
    categoryId?: string,
    userRole?: UserRoleEnum,
  ) {
    const filters = {};
    if (categoryId) {
      filters['category'] = new Types.ObjectId(categoryId);
    }
    if (userRole) {
      filters['role'] = userRole;
    }
    const news = await this.newsModel
      .find({ ...filters })
      .limit(limit)
      .skip(offset)
      .populate('tags');

    const total = await this.newsModel.countDocuments({ ...filters }).exec();
    return {
      data: news,
      total,
    };
  }

  async createNews(dto: CreateNewsDto) {
    const { category_id, tags: tagsDto, ...otherDto } = dto;
    const newsCategory = await this.getNewsCategoryById(category_id);

    const tagsFromDB = await this.tagsService.createManyTags(tagsDto);
    const tags = [];
    for (const tag of tagsFromDB) {
      tags.push(tag._id);
    }

    const news = await this.newsModel.create({
      ...otherDto,
      tags,
      category: newsCategory._id,
    });

    return this.getNewsById(news._id);
  }

  async removeNews(id: string) {
    const result = this.newsModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpException(
        'Document (News) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }

  async changeNews(id: string, dto: PatchNewsDto) {
    const news = await this.getNewsById(id);
    const { tags: tagsDto, ...otherDto } = dto;

    if (tagsDto) {
      const tagsFromDB = await this.tagsService.createManyTags(tagsDto);
      const tags = [];
      for (const tag of tagsFromDB) {
        tags.push(tag._id);
      }
      await news.updateOne({ ...otherDto, tags });
    } else {
      await news.updateOne(otherDto);
    }

    return this.getNewsById(id);
  }
}
