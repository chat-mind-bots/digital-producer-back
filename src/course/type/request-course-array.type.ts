import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/schemas/course.schema';
import { Types } from 'mongoose';

class ICourseWithUpdates extends Course {
  _id: Types.ObjectId;
  is_enrolled: boolean;
}
export class RequestCourseArrayType {
  @ApiProperty({
    type: [ICourseWithUpdates],
  })
  readonly data: ICourseWithUpdates[];

  @ApiProperty({ type: Number })
  readonly total: number;
}
