import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { CurseStatusEnum } from 'src/course/enum/curse-status.enum';

export class UpdateCourseStatusQueryDto {
  @ApiProperty({
    example: CurseStatusEnum.IN_REVIEW,
    description: 'Course status',
    enum: CurseStatusEnum,
    required: false,
    type: Number,
  })
  @IsString()
  @IsEnum(CurseStatusEnum)
  readonly status: CurseStatusEnum;
}
