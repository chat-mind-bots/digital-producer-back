import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CourseLevelDifficultlyEnum } from 'src/course/enum/course-level-dificultly.enum';
import { Documents } from 'src/document/document.schema';
import { User } from 'src/user/user.schema';
import { Question } from 'src/test/schemas/question.schema';

@Schema()
export class CourseLesson {
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
  @Prop({
    required: true,
    default: CourseLevelDifficultlyEnum.MEDIUM,
    type: Number,
    enum: CourseLevelDifficultlyEnum,
  })
  level_difficulty: CourseLevelDifficultlyEnum;

  @ApiProperty()
  @Prop({ required: true, type: Number })
  logic_number: number;

  @ApiProperty()
  @Prop({ required: true, type: [Types.ObjectId], ref: Documents.name })
  documents: [Types.ObjectId];

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: Question.name,
    default: [],
  })
  tests: [Types.ObjectId];

  @ApiProperty()
  @Prop({ default: now() })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now() })
  updatedAt: Date;
}
export const CourseLessonSchema = SchemaFactory.createForClass(CourseLesson);

export type CourseLessonDocument = CourseLesson & Document;
