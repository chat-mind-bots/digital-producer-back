import { ApiProperty } from '@nestjs/swagger';
import { Banner } from 'src/banner/banner.schema';

export class RequestArrayType {
  @ApiProperty({
    type: [Banner],
  })
  readonly data: Banner[];

  @ApiProperty({ type: Number })
  readonly total: number;
}
