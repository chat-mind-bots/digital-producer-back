import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsValidId } from 'src/common/validators/query-object-id-validator.decorator';

export class AddQuestionToTestQueryDto {
  @ApiProperty({
    example: ['83f...', 'c32...', '9a7...'],
    description: 'Array of question ids',
    required: false,
  })
  @IsString({ each: true })
  @IsValidId({ each: true })
  readonly 'question-id': string[];
}
