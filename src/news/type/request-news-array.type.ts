import { ApiProperty } from '@nestjs/swagger';
import { News } from 'src/news/news.schema';

export class RequestNewsArrayType {
  @ApiProperty({
    type: [News],
  })
  readonly data: News[];

  @ApiProperty({ type: Number })
  readonly total: number;
}
