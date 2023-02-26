import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Answer, IAnswer } from 'src/test/schemas/question.schema';

export class ChangeQuestionDto {
  @ApiProperty({
    example: 'Question name',
    description: 'Question name',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 'Question description',
    description: 'Question description',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: 'Question question',
    description: 'Question question',
    required: true,
  })
  @IsOptional()
  @IsString()
  readonly question?: string;

  @ApiProperty({
    example: [
      {
        key: 'answer_1',
        value: 'Some text for answer',
      },
    ],
    description: 'answers array',
    required: false,
    type: Answer,
  })
  @IsOptional()
  @IsArray()
  readonly answers?: [IAnswer];

  @ApiProperty({
    example: 'answer_1',
    description: 'Right answer key',
    required: false,
  })
  @IsOptional()
  @IsString()
  right_answer?: string;

  @ApiProperty({
    example: ['answer_1', 'answer_2'],
    description: 'Right answers key in  array',
    required: false,
  })
  @IsOptional()
  @IsArray()
  right_answers?: [string];

  @ApiProperty({
    example: true,
    description: 'The question  is multiply?',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_multiply?: boolean;
}
