import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.schema';

export class RequestArrayType {
  @ApiProperty({
    type: [User],
  })
  readonly data: User[];

  @ApiProperty({ type: Number })
  readonly total: number;
}
