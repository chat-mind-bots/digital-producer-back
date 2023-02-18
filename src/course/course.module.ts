import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CourseCategory,
  CourseCategorySchema,
  CourseSubCategory,
  CourseSubCategorySchema,
} from 'src/course/schemas/course-category.schema';
import {
  CourseLesson,
  CourseLessonSchema,
} from 'src/course/schemas/course-lesson.schema';
import {
  CourseModule as CourseModuleModel,
  CourseModuleSchema,
} from 'src/course/schemas/course-module.schema';
import { DocumentModule } from 'src/document/document.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseCategory.name, schema: CourseCategorySchema },
      { name: CourseSubCategory.name, schema: CourseSubCategorySchema },
      { name: CourseLesson.name, schema: CourseLessonSchema },
      { name: CourseModuleModel.name, schema: CourseModuleSchema },
    ]),
    forwardRef(() => DocumentModule),
    forwardRef(() => AuthModule),
  ],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
