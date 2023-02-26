import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CourseLevelDifficultlyEnum } from 'src/course/enum/course-level-dificultly.enum';
import { Documents } from 'src/document/document.schema';
import { User } from 'src/user/user.schema';
import { CurseStatusEnum } from 'src/course/enum/curse-status.enum';
import { Tag } from 'src/tags/tags.schema';
import { CourseModule } from 'src/course/schemas/course-module.schema';
import { CourseSubCategory } from 'src/course/schemas/course-category.schema';

export interface ICoursePrice {
  actual: number;
  discount: number;
}
@Schema()
export class Price extends Document {
  @ApiProperty()
  @Prop({ required: true, type: Number })
  actual: number;

  @ApiProperty()
  @Prop({ required: false, type: Number })
  discount: number;
}

export const PriceSchema = SchemaFactory.createForClass(Price);

export interface ICourseNote {
  name: string;
  value: string;
}
@Schema()
export class Note extends Document {
  @ApiProperty()
  @Prop({ required: true, type: String })
  name: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  value: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

@Schema()
export class Course {
  @ApiProperty()
  @Prop({ required: true, type: String })
  name: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  description: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  image: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  video: string;

  @ApiProperty()
  @Prop({ required: true, type: Boolean })
  is_free: boolean;

  @ApiProperty()
  @Prop({ required: true, type: String })
  language: string;

  @ApiProperty()
  @Prop({
    required: true,
    default: CurseStatusEnum.IN_PROGRESS,
    type: String,
    enum: CurseStatusEnum,
  })
  status: CurseStatusEnum;

  @ApiProperty()
  @Prop({ required: false, type: PriceSchema })
  price: ICoursePrice;

  @ApiProperty()
  @Prop({
    required: true,
    default: CourseLevelDifficultlyEnum.MEDIUM,
    type: Number,
    enum: CourseLevelDifficultlyEnum,
  })
  level_difficulty: CourseLevelDifficultlyEnum;

  @ApiProperty()
  @Prop({ type: [Types.ObjectId], ref: Tag.name })
  tags: [Types.ObjectId];

  @ApiProperty()
  @Prop({ required: true, type: [NoteSchema], default: [] })
  notes: [ICourseNote];

  @ApiProperty()
  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: Documents.name,
    default: [],
  })
  documents: [Types.ObjectId];

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, type: [Types.ObjectId], ref: User.name, default: [] })
  students: [Types.ObjectId];

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: CourseSubCategory.name })
  sub_category: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: CourseModule.name,
    default: [],
  })
  modules: [Types.ObjectId];

  @ApiProperty()
  @Prop({ default: now() })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now() })
  updatedAt: Date;
}
export const CourseSchema = SchemaFactory.createForClass(Course);

export type CourseDocument = Course & Document;
