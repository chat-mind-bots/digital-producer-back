import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidId } from 'src/common/validators/query-object-id-validator.decorator';

export class AddLessonToCourseModuleQueryDto {
  @ApiProperty({
    example: '83f...',
    description: 'Lesson id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsValidId()
  readonly 'lesson-id': string;
}
