import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { IPhotos, Photo } from 'src/user/user.schema';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'telegram user name',
    required: true,
  })
  @IsOptional()
  @IsString()
  readonly first_name?: string;

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
  readonly photos?: IPhotos;
}
