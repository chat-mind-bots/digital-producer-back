import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export class PatchNewsCategoryDto {
  @ApiProperty({
    example: 'News about IT',
    description: 'news title',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    example: UserRoleEnum.USER,
    description: 'User role who can see news',
    required: false,
    enum: UserRoleEnum,
    examples: [UserRoleEnum.USER, UserRoleEnum.PRODUCER],
    type: String,
  })
  @IsString()
  @IsEnum(UserRoleEnum)
  @IsOptional()
  readonly role?: UserRoleEnum;

  @ApiProperty({
    example: '#FFFF',
    description: 'news tags color',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly tags_color?: string;
}
