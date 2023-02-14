import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export class CreateNewsCategoryDto {
  @ApiProperty({
    example: 'News about IT',
    description: 'type title',
    required: true,
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: UserRoleEnum.USER,
    description: 'User role who can see type',
    required: true,
    enum: UserRoleEnum,
    examples: [UserRoleEnum.USER, UserRoleEnum.PRODUCER],
    type: String,
  })
  @IsString()
  @IsEnum(UserRoleEnum)
  readonly role: UserRoleEnum;

  @ApiProperty({
    example: '#FFFF',
    description: 'type rags color',
    required: true,
  })
  @IsString()
  readonly tags_color: string;
}
