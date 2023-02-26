import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { toLowerCase, trim } from 'src/common/helpers/query.helper';
import { ApiProperty } from '@nestjs/swagger';

export class UserGetByUsernameQueryDto {
  @Transform(({ value }) => trim(toLowerCase(value)))
  @ApiProperty({
    example: 'John233',
    description: 'username of user',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  readonly q?: string;
}
