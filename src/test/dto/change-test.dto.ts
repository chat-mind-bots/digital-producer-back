import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Answer, IAnswer } from 'src/test/test.schema';

export class ChangeTestDto {
  @ApiProperty({
    example: 'Test name',
    description: 'Test name',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 'Test description',
    description: 'Test description',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: 'Test question',
    description: 'Test question',
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
}
