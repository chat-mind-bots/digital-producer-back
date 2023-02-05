import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { IPhotos, Photo } from 'src/user/user.schema';

export class CreateUserDto {
  @ApiProperty({
    example: '10988',
    description: 'telegram user id',
    required: true,
  })
  @IsNumber()
  readonly tg_id: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'telegram user name',
    required: true,
  })
  @IsString()
  readonly first_name: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'telegram user username',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly username?: string;

  @ApiProperty({
    example: 'private',
    description: 'telegram chat type',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly type?: string;

  @ApiProperty({
    example: UserRoleEnum.USER,
    description: 'user role',
    required: true,
    enum: UserRoleEnum,
  })
  @IsArray()
  readonly role: UserRoleEnum[];

  @ApiProperty({
    example: {
      small: 'https://photo.com/image.jpg',
      big: 'https://photo.com/image.jpg',
    },
    description: 'user role',
    required: false,
    type: Photo,
  })
  @IsObject()
  @IsOptional()
  readonly photos: IPhotos;
}
