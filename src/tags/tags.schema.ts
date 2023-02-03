import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TagDocument = Tag & Document;

@Schema()
export class Tag {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  background: string;

  @ApiProperty()
  @Prop({ required: false })
  color: string;

  // @Prop({ required: false })
  // translations: {
  //   ru: {
  //     name: string;
  //   };
  // };

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
