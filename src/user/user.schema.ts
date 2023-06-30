import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

export type UserDocument = User & Document;

export interface IPhotos {
  small: URL;
  big: URL;
}
@Schema()
export class Photo extends Document {
  @Prop({ required: true })
  small: string;

  @Prop()
  big: string;
}
export const PhotoSchema = SchemaFactory.createForClass(Photo);

@Schema()
export class User {
  @ApiProperty()
  @Prop({ required: true })
  tg_id: number;

  @ApiProperty()
  @Prop({ required: true })
  first_name: string;

  @ApiProperty()
  @Prop({ required: false })
  username: string;

  @ApiProperty()
  @Prop({ required: false })
  type: string;

  @ApiProperty()
  @Prop({
    required: true,
    default: [UserRoleEnum.USER],
    type: [String],
  })
  role: UserRoleEnum[];

  @ApiProperty()
  @Prop({ required: false, type: PhotoSchema })
  photos: IPhotos;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
