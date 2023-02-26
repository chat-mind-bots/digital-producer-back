import { Document, now, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';

export type QuestionDocument = Question & Document;

export interface IAnswer {
  key: string;
  value: string;
}
@Schema()
export class Answer extends Document {
  @ApiProperty()
  @Prop({ required: true })
  key: string;

  @ApiProperty()
  @Prop({ required: true })
  value: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
@Schema()
export class Question {
  @ApiProperty()
  @Prop({ required: false })
  name: string;

  @ApiProperty()
  @Prop({ required: false })
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  question: string;

  @ApiProperty()
  @Prop({ required: true, type: [AnswerSchema], ref: Answer.name })
  answers: [IAnswer];

  @ApiProperty()
  @Prop({ required: false, type: String })
  right_answer: string;

  @ApiProperty()
  @Prop({ required: false, type: [String] })
  right_answers: string[];

  @ApiProperty()
  @Prop({ required: true, type: Boolean })
  is_multiply: boolean;

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

export const QuestionSchema = SchemaFactory.createForClass(Question);
