import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.schema';
import { CourseLesson } from 'src/course/schemas/course-lesson.schema';

@Schema()
export class CourseModule {
  @ApiProperty()
  @Prop({ required: true, type: String })
  name: string;

  @ApiProperty()
  @Prop({ required: true, type: Number })
  logic_number: number;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, type: [Types.ObjectId], ref: CourseLesson.name })
  lessons: [Types.ObjectId];

  @ApiProperty()
  @Prop({ default: now() })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now() })
  updatedAt: Date;
}
export const CourseModuleSchema = SchemaFactory.createForClass(CourseModule);

export type CourseModuleDocument = CourseModule & Document;
