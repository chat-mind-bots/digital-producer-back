import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import { Tag } from 'src/tags/tags.schema';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export type NewsDocument = News & Document;

@Schema()
export class News {
  @ApiProperty()
  @Prop({ required: true, type: String })
  name: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  description: string;

  @ApiProperty()
  @Prop({ required: true, type: Number })
  time_read: number;

  @ApiProperty()
  @Prop({ required: true, type: Date, default: now() })
  date: Date;

  @ApiProperty()
  @Prop({ required: true, type: String })
  image: string;

  @ApiProperty()
  @Prop({ type: [Types.ObjectId], ref: Tag.name })
  tags: [Types.ObjectId];
}
export const NewsSchema = SchemaFactory.createForClass(News);

export type NewsCategoryDocument = NewsCategory & Document;
@Schema()
export class NewsCategory {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({
    required: true,
    default: UserRoleEnum.USER,
    type: String,
    enum: UserRoleEnum,
  })
  role: UserRoleEnum;

  @ApiProperty()
  @Prop({ required: true })
  tags_color: string;

  @ApiProperty()
  @Prop({ type: [Types.ObjectId], ref: News.name })
  list: [Types.ObjectId];

  @ApiProperty()
  @Prop({ default: now() })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now() })
  updatedAt: Date;
}

export const NewsCategorySchema = SchemaFactory.createForClass(NewsCategory);
