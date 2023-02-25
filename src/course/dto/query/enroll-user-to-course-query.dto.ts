import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsValidId } from 'src/common/validators/query-object-id-validator.decorator';

export class EnrollUserToCourseQueryDto {
  @ApiProperty({
    example: ['83f...', 'c32...', '9a7...'],
    description: 'Array of sub-categories ids',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @IsValidId({ each: true })
  readonly 'user-id'?: string[];
}
