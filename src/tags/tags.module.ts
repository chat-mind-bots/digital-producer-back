import { forwardRef, Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from 'src/tags/tags.schema';
import { BannerModule } from 'src/banner/banner.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    forwardRef(() => BannerModule),
  ],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
