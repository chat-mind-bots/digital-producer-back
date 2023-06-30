import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'IT',
    description: 'tag name',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: '#fffff',
    description: 'background color',
    required: true,
  })
  @IsString()
  readonly background: string;

  @ApiProperty({
    example: '#fffff',
    description: 'text color',
    required: true,
  })
  @IsString()
  readonly color: string;

  // @ApiProperty({
  //   example: {
  //     ru: {
  //       name: 'АЙТИ',
  //     },
  //   },
  //   description: 'tag translation',
  //   required: false,
  // })
  // readonly translations?: {
  //   ru: {
  //     name: string;
  //   };
  // };
}
