import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidId } from 'src/common/validators/query-object-id-validator.decorator';

export class AddModuleToCourseCourseQueryDto {
  @ApiProperty({
    example: '83f...',
    description: 'Module id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsValidId()
  readonly 'module-id': string;
}
