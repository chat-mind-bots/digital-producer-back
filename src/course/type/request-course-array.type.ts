import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/schemas/course.schema';

export class RequestCourseArrayType {
  @ApiProperty({
    type: [Course],
  })
  readonly data: Course[];

  @ApiProperty({ type: Number })
  readonly total: number;
}
