import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Banner, BannerDocument } from 'src/banner/banner.schema';
import { Model } from 'mongoose';
import { CreateBannerDto } from 'src/banner/dto/create-banner.dto';
import { TagsService } from 'src/tags/tags.service';
import { BannerTypeEnum } from 'src/banner/enums/banner-type.enum';
import { PatchBannerDto } from 'src/banner/dto/patch-banner.dto';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { RequestArrayType } from 'src/banner/types/request-array.type';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<BannerDocument>,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
  ) {}

  async getBanners(
    limit: number,
    offset: number,
    type?: BannerTypeEnum,
    userRole?: UserRoleEnum,
  ): Promise<RequestArrayType> {
    const filters = {};
    if (type) {
      filters['type'] = type;
    }

    if (userRole) {
      filters['role'] = userRole;
    }
    const banners = await this.bannerModel
      .find(filters)
      .limit(limit)
      .skip(offset)
      .populate('tags');

    const total = await this.bannerModel.countDocuments({ ...filters }).exec();
    return {
      data: banners,
      total,
    };
  }

  async getBannerById(id: string) {
    const banner = await this.bannerModel.findById(id).populate('tags');
    if (!banner) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    return banner;
  }

  async createBanner(dto: CreateBannerDto) {
    const { tags: tagsDto, ...bannerDto } = dto;
    const tagsFromDB = await this.tagsService.createManyTags(tagsDto);
    const tags = [];
    for (const tag of tagsFromDB) {
      tags.push(tag._id);
    }
    const banner = await this.bannerModel.create({
      ...bannerDto,
      tags,
    });
    return this.bannerModel.findById(banner._id).populate('tags');
  }

  async changeBanner(id: string, dto: PatchBannerDto) {
    const banner = await this.getBannerById(id);
    const { tags: tagsDto, ...otherDto } = dto;
    if (tagsDto) {
      const tagsFromDB = await this.tagsService.createManyTags(tagsDto);
      const tags = [];
      for (const tag of tagsFromDB) {
        tags.push(tag._id);
      }
      await banner.updateOne({ ...otherDto, tags });
    } else {
      await banner.updateOne(otherDto);
    }
    return this.getBannerById(id);
  }

  async deleteBanner(id: string) {
    const result = await this.bannerModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
