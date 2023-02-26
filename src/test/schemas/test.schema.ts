import { Document, now, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import {
  Answer,
  AnswerSchema,
  IAnswer,
  Question,
} from 'src/test/schemas/question.schema';
import { ProgressStatusEnum } from 'src/test/enum/progress-status.enum';
import { CourseLesson } from 'src/course/schemas/course-lesson.schema';

export type TestDocument = Test & Document;

export interface IProgress {
  status: ProgressStatusEnum;
  answers: IAnswer[];
  duration: number;
  user: string;
}
@Schema()
export class Progress extends Document {
  @ApiProperty()
  @Prop({
    required: true,
    default: ProgressStatusEnum.IN_PROGRESS,
    type: String,
  })
  status: ProgressStatusEnum;

  @ApiProperty()
  @Prop({ required: true, type: [AnswerSchema], ref: Answer.name, default: [] })
  answers: [IAnswer];

  @ApiProperty()
  @Prop({ required: true, type: Number })
  duration: number;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

@Schema()
export class Test {
  @ApiProperty()
  @Prop({ required: false })
  name: string;

  @ApiProperty()
  @Prop({ required: false })
  description: string;

  @ApiProperty()
  @Prop({ required: true, type: Number })
  duration: number;

  @ApiProperty()
  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: Question.name,
    default: [],
  })
  questions: [Types.ObjectId];

  @ApiProperty()
  @Prop({
    required: true,
    type: [ProgressSchema],
    default: [],
  })
  progress: IProgress[];

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: CourseLesson.name })
  lesson: Types.ObjectId;

  @ApiProperty()
  @Prop({ default: now() })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now() })
  updatedAt: Date;
}

export const TestSchema = SchemaFactory.createForClass(Test);
