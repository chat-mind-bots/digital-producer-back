import { Injectable } from '@nestjs/common';
import { Tag, TagDocument } from 'src/tags/tags.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
  ) {}

  async findTagByName(name: string) {
    const tag = await this.tagModel.findOne({ name });
    return tag;
  }

  async createManyTags(dtos: CreateTagDto[]) {
    const tags = dtos.map(async (dto) => await this.createTag(dto));
    return tags;
  }

  async createTag(dto: CreateTagDto) {
    const oldTag = await this.findTagByName(dto.name.toLowerCase());
    if (oldTag) {
      return oldTag;
    }
    const tag = await this.tagModel.create({
      ...dto,
      name: dto.name.toLowerCase(),
    });
    return tag;
  }
}
