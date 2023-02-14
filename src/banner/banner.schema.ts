import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import { BannerTypeEnum } from 'src/banner/enums/banner-type.enum';
import { Tag } from 'src/tags/tags.schema';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export type BannerDocument = Banner & Document;

@Schema()
export class Banner {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: BannerTypeEnum,
    default: BannerTypeEnum.SLIDER,
  })
  type: string;

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
  url_button: string;

  @ApiProperty()
  @Prop({ required: true })
  text_button: string;

  @ApiProperty()
  @Prop({ required: true })
  style_button: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  image: string;

  @ApiProperty()
  @Prop({ required: false })
  is_third_party_source: boolean;

  // @Prop({
  //   required: false,
  //   default: {
  //     translations: {
  //       ru: {},
  //     },
  //   },
  // })
  // translations: {
  //   ru: {
  //     title: string;
  //     textButton: string;
  //     name: string;
  //     description: string;
  //   };
  // };

  @ApiProperty()
  @Prop({ type: [Types.ObjectId], ref: Tag.name })
  tags: [Types.ObjectId];

  @ApiProperty()
  @Prop({ default: now() })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now() })
  updatedAt: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
