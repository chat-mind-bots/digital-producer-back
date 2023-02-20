import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidId } from 'src/common/validators/query-object-id-validator.decorator';

export class RemoveTestFromCourseLessonQueryDto {
  @ApiProperty({
    example: '83f...',
    description: 'Document id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsValidId()
  readonly 'test-id': string;
}
