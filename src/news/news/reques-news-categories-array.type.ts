import { ApiProperty } from '@nestjs/swagger';
import { NewsCategory } from 'src/news/news.schema';

export class RequestNewsCategoriesArrayType {
  @ApiProperty({
    type: [NewsCategory],
  })
  readonly data: NewsCategory[];

  @ApiProperty({ type: Number })
  readonly total: number;
}
