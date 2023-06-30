import { Document, now, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';

export type DocumentsDocument = Documents & Document;

@Schema()
export class Documents {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  url: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

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

export const DocumentsSchema = SchemaFactory.createForClass(Documents);
