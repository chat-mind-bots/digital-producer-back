import { ApiProperty } from '@nestjs/swagger';
import { CourseCategory } from 'src/course/schemas/course-category.schema';

export class RequestCourseCategoriesArrayType {
  @ApiProperty({
    type: [CourseCategory],
  })
  readonly data: CourseCategory[];

  @ApiProperty({ type: Number })
  readonly total: number;
}
