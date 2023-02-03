import { forwardRef, Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [forwardRef(() => TagsModule)],
  providers: [BannerService],
  controllers: [BannerController],
})
export class BannerModule {}
