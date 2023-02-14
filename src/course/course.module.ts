import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CourseCategory,
  CourseCategorySchema,
  CourseSubCategory,
  CourseSubCategorySchema,
} from 'src/course/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseCategory.name, schema: CourseCategorySchema },
      { name: CourseSubCategory.name, schema: CourseSubCategorySchema },
    ]),
  ],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
