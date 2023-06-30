import { forwardRef, Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TagsModule } from 'src/tags/tags.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from 'src/banner/banner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
    forwardRef(() => TagsModule),
  ],
  providers: [BannerService],
  controllers: [BannerController],
})
export class BannerModule {}
