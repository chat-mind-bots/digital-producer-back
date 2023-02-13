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
import { Model } from 'mongoose';
import { TagsService } from 'src/tags/tags.service';
import { PatchNewsCategoryDto } from 'src/news/dto/patch-news-category.dto';

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
    const newsCategory = await this.newsCategoriesModel.findById(id, '-list');
    if (!newsCategory) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    return newsCategory;
  }
  async creatNewsCategory(dto: CreateNewsCategoryDto) {
    // const fullList = [];
    // for (const listDto of dto) {
    //   const { tags: tagsDto } = listDto;
    //   const tagsFromDB = await this.tagsService.createManyTags(tagsDto);
    //   const tags = [];
    //   for (const tag of tagsFromDB) {
    //     tags.push(tag._id);
    //   }
    //   const list = await this.newsListModel.create({ ...listDto, tags });
    //   fullList.push(list._id);
    // }

    const newsCategory = await this.newsCategoriesModel.create({
      ...dto,
      list: [],
    });

    return this.getNewsCategoryById(newsCategory._id);
  }

  async getAllNewsCategories(limit: number, offset: number) {
    const newsCategories = await this.newsCategoriesModel
      .find({}, '-list')
      .limit(limit)
      .skip(offset)
      .exec();
    const total = await this.newsCategoriesModel.countDocuments().exec();
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
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
