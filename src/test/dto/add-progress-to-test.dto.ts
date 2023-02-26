import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { ProgressStatusEnum } from 'src/test/enum/progress-status.enum';
import { IProgressAnswer, ProgressAnswer } from 'src/test/schemas/test.schema';

export class AddProgressToTestDto {
  @ApiProperty({
    example: 100,
    description: 'Actual duration in ms',
    required: true,
  })
  @IsNumber()
  readonly duration: number;

  @ApiProperty({
    example: ProgressStatusEnum.IN_PROGRESS,
    description: 'Progress status',
    required: true,
    enum: ProgressStatusEnum,
  })
  @IsString()
  @IsEnum(ProgressStatusEnum)
  readonly status: ProgressStatusEnum;

  @ApiProperty({
    example: [
      {
        question: '83f...',
        answer_key: ['key_1', 'key_2'],
      },
    ],
    description:
      'Answers on test, answer_key can be string[] if question is not multiply - use [answer_key]]',
    type: [ProgressAnswer],
    required: true,
  })
  @IsArray()
  readonly answers: [IProgressAnswer];
}
