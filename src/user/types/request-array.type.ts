import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.schema';

export class RequestUsersArrayType {
  @ApiProperty({
    type: [User],
  })
  readonly data: User[];

  @ApiProperty({ type: Number })
  readonly total: number;
}
