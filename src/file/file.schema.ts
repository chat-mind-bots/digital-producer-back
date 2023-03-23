import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import { BannerTypeEnum } from 'src/banner/enums/banner-type.enum';
import { Tag } from 'src/tags/tags.schema';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { User } from 'src/user/user.schema';

export type FileDocument = File & Document;

@Schema()
export class File {
  @ApiProperty()
  @Prop({ required: true })
  e_tag: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  location: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  url: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  key: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  bucket: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  domain: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: Number,
  })
  file_size: number;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop({ default: now() })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now() })
  updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
