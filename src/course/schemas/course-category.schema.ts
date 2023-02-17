import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class CourseCategory {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  tags_color: string;

  @ApiProperty()
  @Prop({ default: now() })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now() })
  updatedAt: Date;
}
export const CourseCategorySchema =
  SchemaFactory.createForClass(CourseCategory);

export type CourseSubCategoryDocument = CourseSubCategory & Document;
@Schema()
export class CourseSubCategory {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  tags_color: string;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: CourseCategory.name })
  category: Types.ObjectId;

  @ApiProperty()
  @Prop({ default: now() })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now() })
  updatedAt: Date;
}

export const CourseSubCategorySchema =
  SchemaFactory.createForClass(CourseSubCategory);

export type CourseCategoryDocument = CourseCategory & Document;
