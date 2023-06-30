import { ApiProperty } from '@nestjs/swagger';
import { CourseSubCategory } from 'src/course/schemas/course-category.schema';

export class RequestCourseSubCategoriesArrayType {
  @ApiProperty({
    type: [CourseSubCategory],
  })
  readonly data: CourseSubCategory[];

  @ApiProperty({ type: Number })
  readonly total: number;
}
