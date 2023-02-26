import { forwardRef, Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from 'src/test/schemas/question.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Test, TestSchema } from 'src/test/schemas/test.schema';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Test.name, schema: TestSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => CourseModule),
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
