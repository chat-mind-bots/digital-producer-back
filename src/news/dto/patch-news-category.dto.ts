import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export class PatchNewsCategoryDto {
  @ApiProperty({
    example: 'News about IT',
    description: 'news title',
    required: true,
  })
  @IsString()
  readonly title?: string;

  @ApiProperty({
    example: UserRoleEnum.USER,
    description: 'User role who can see news',
    required: true,
    enum: UserRoleEnum,
    examples: [UserRoleEnum.USER, UserRoleEnum.PRODUCER],
    type: String,
  })
  @IsString()
  @IsEnum(UserRoleEnum)
  readonly role?: UserRoleEnum;

  @ApiProperty({
    example: '#FFFF',
    description: 'news rags color',
    required: true,
  })
  @IsString()
  readonly tags_color?: string;
}
