import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { CreateCourseCategoryDto } from 'src/course/dto/category/create-course-category.dto';
import {
  CourseCategory,
  CourseSubCategory,
} from 'src/course/schemas/course-category.schema';
import { Public } from 'src/auth/public-route.decorator';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { RequestCourseCategoriesArrayType } from 'src/course/type/request-course-categories-array.type';
import { CreateCourseSubCategoryDto } from 'src/course/dto/sub-category/create-course-sub-category.dto';
import { RequestCourseSubCategoriesArrayType } from 'src/course/type/request-course-sub-categories-array.type';
import { ChangeCourseCategoryDto } from 'src/course/dto/category/change-course-category.dto';
import { ChangeCourseSubCategoryDto } from 'src/course/dto/sub-category/change-course-sub-category.dto';
import { CourseLesson } from 'src/course/schemas/course-lesson.schema';
import { CreateCourseLessonDto } from 'src/course/dto/lesson/create-course-lesson.dto';
import { ChangeCourseLessonDto } from 'src/course/dto/lesson/change-course-lesson.dto';
import { AddDocumentToCourseLessonQueryDto } from 'src/course/dto/query/add-document-to-course-lesson-query.dto';
import { CourseModule } from 'src/course/schemas/course-module.schema';
import { CreateCourseModuleDto } from 'src/course/dto/module/create-course-module.dto';
import { ChangeCourseModuleDto } from 'src/course/dto/module/change-course-module.dto';
import { AddLessonToCourseModuleQueryDto } from 'src/course/dto/query/add-lesson-to-course-module-query.dto';
import { Course } from 'src/course/schemas/course.schema';
import { CreateCourseDto } from 'src/course/dto/course/create-course.dto';
import { ChangeCourseDto } from 'src/course/dto/course/change-course.dto';
import { AddModuleToCourseCourseQueryDto } from 'src/course/dto/query/add-module-to-course-course-query.dto';
import { RequestCourseArrayType } from 'src/course/type/request-course-array.type';
import { GetCoursesQueryDto } from 'src/course/dto/query/get-courses-query.dto';
import { EnrollUserToCourseQueryDto } from 'src/course/dto/query/enroll-user-to-course-query.dto';
import { UpdateCourseStatusQueryDto } from 'src/course/dto/query/update-course-status-query.dto';
import { GetCourseQueryDto } from 'src/course/dto/query/get-course-query.dto';

@Controller('course')
@ApiTags('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // CATEGORIES

  @ApiOperation({ summary: 'Create course Category' })
  @ApiResponse({ status: 201, type: CourseCategory })
  @Roles(UserRoleEnum.ADMIN)
  @Post('category')
  async createCourseCategory(@Body() dto: CreateCourseCategoryDto) {
    return this.courseService.createCategory(dto);
  }

  @ApiOperation({ summary: 'Change course Category' })
  @ApiResponse({ status: 200, type: CourseCategory })
  @Roles(UserRoleEnum.ADMIN)
  @UsePipes(MongoIdPipe)
  @Patch('category/:id')
  async changeCourseCategory(
    @Param('id') id: string,
    @Body() dto: ChangeCourseCategoryDto,
  ) {
    return this.courseService.changeCategory(id, dto);
  }

  @ApiOperation({ summary: 'Get course Category by id' })
  @ApiResponse({ status: 200, type: CourseCategory })
  @Public()
  @UsePipes(MongoIdPipe)
  @Get('category/:id')
  async getCourseCategory(@Param('id') id: string) {
    return this.courseService.getCategoryById(id);
  }

  @ApiOperation({ summary: 'Get course Categories' })
  @ApiResponse({ status: 200, type: RequestCourseCategoriesArrayType })
  @Public()
  @Get('category')
  async getCourseCategories() {
    return this.courseService.getCategories();
  }

  @ApiOperation({ summary: 'Delete course Categories' })
  @ApiResponse({ status: 200, type: CourseCategory })
  @UsePipes(MongoIdPipe)
  @Roles(UserRoleEnum.ADMIN)
  @Delete('category/:id')
  async removeCourseCategories(@Param('id') id: string) {
    return this.courseService.removeCategory(id);
  }

  // SUB-CATEGORIES
  @ApiOperation({ summary: 'Create course SubCategory' })
  @ApiResponse({ status: 201, type: CourseSubCategory })
  @Roles(UserRoleEnum.ADMIN)
  @Post('sub-category')
  async createCourseSubCategory(@Body() dto: CreateCourseSubCategoryDto) {
    return this.courseService.createSubCategory(dto);
  }

  @ApiOperation({ summary: 'Change course SubCategory' })
  @ApiResponse({ status: 200, type: CourseSubCategory })
  @Roles(UserRoleEnum.ADMIN)
  @UsePipes(MongoIdPipe)
  @Patch('sub-category/:id')
  async changeCourseSubCategory(
    @Param('id') id: string,
    @Body() dto: ChangeCourseSubCategoryDto,
  ) {
    return this.courseService.changeSubCategory(id, dto);
  }

  @ApiOperation({ summary: 'Get course SubCategory by id' })
  @ApiResponse({ status: 200, type: CourseSubCategory })
  @Public()
  @UsePipes(MongoIdPipe)
  @Get('sub-category/:id')
  async getCourseSubCategory(@Param('id') id: string) {
    return this.courseService.getSubCategoryById(id);
  }

  @ApiOperation({ summary: 'Get course SubCategories' })
  @ApiResponse({ status: 200, type: RequestCourseSubCategoriesArrayType })
  @Public()
  @Get('sub-category')
  async getCourseSubCategories() {
    return this.courseService.getSubCategories();
  }

  @ApiOperation({ summary: 'Delete course SubCategories' })
  @ApiResponse({ status: 200, type: CourseCategory })
  @UsePipes(MongoIdPipe)
  @Roles(UserRoleEnum.ADMIN)
  @Delete('sub-category/:id')
  async removeCourseSubCategories(@Param('id') id: string) {
    return this.courseService.removeSubCategory(id);
  }

  // LESSOONS

  @ApiOperation({ summary: 'Create course lesson' })
  @ApiResponse({ status: 201, type: CourseLesson })
  @Roles(UserRoleEnum.PRODUCER)
  @Post('lesson')
  async createCourseLesson(@Req() req, @Body() dto: CreateCourseLessonDto) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.createLesson(dto, token);
  }

  @ApiOperation({ summary: 'Get course lesson by id' })
  @ApiResponse({ status: 200, type: CourseLesson })
  @Roles(UserRoleEnum.USER)
  @UsePipes(MongoIdPipe)
  @Get('lesson/:id')
  async getCourseLesson(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.getLessonByIdWithTest(id, token);
  }

  @ApiOperation({ summary: 'Change course lesson' })
  @ApiResponse({ status: 200, type: CourseLesson })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch('lesson/:id')
  async changeCourseLesson(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: ChangeCourseLessonDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.changeLesson(id, dto, token);
  }

  @ApiOperation({ summary: 'Remove course lesson' })
  @ApiResponse({ status: 200, type: CourseLesson })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Delete('lesson/:id')
  async removeCourseLesson(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.removeLesson(id, token);
  }

  @ApiOperation({ summary: 'Add document to course lesson' })
  @ApiResponse({ status: 200, type: CourseLesson })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch('lesson/:id/document')
  async addDocumentToCourseLesson(
    @Req() req,
    @Param('id') id: string,
    @Query() query: AddDocumentToCourseLessonQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.addDocumentToLesson(
      id,
      query['document-id'],
      token,
    );
  }

  @ApiOperation({ summary: 'Remove document from course lesson' })
  @ApiResponse({ status: 200, type: CourseLesson })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Delete('lesson/:id/document')
  async removeDocumentFromCourseLesson(
    @Req() req,
    @Param('id') id: string,
    @Query() query: AddDocumentToCourseLessonQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.removeDocumentFromLesson(
      id,
      query['document-id'],
      token,
    );
  }

  // @ApiOperation({ summary: 'Add test or tests array to course lesson' })
  // @ApiResponse({ status: 200, type: CourseLesson })
  // @Roles(UserRoleEnum.PRODUCER)
  // @UsePipes(MongoIdPipe)
  // @Patch('lesson/:id/test')
  // async addTestToCourseLesson(
  //   @Req() req,
  //   @Param('id') id: string,
  //   @Query() query: AddTestToCourseLessonQueryDto,
  // ) {
  //   const bearer = req.headers.authorization;
  //   const token = bearer.split('Bearer ')[1];
  //   return this.courseService.addTestToLesson(id, query, token);
  // }
  //
  // @ApiOperation({ summary: 'Remove test from course lesson' })
  // @ApiResponse({ status: 200, type: CourseLesson })
  // @Roles(UserRoleEnum.PRODUCER)
  // @UsePipes(MongoIdPipe)
  // @Delete('lesson/:id/test')
  // async removeTestFromCourseLesson(
  //   @Req() req,
  //   @Param('id') id: string,
  //   @Query() query: RemoveTestFromCourseLessonQueryDto,
  // ) {
  //   const bearer = req.headers.authorization;
  //   const token = bearer.split('Bearer ')[1];
  //   return this.courseService.removeTestFromLesson(id, query['test-id'], token);
  // }

  // Module

  @ApiOperation({ summary: 'Create course module' })
  @ApiResponse({ status: 201, type: CourseModule })
  @Roles(UserRoleEnum.PRODUCER)
  @Post('module')
  async createCourseModule(@Req() req, @Body() dto: CreateCourseModuleDto) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.createModule(dto, token);
  }

  @ApiOperation({ summary: 'Get course module' })
  @ApiResponse({ status: 200, type: CourseModule })
  @Roles(UserRoleEnum.USER)
  @UsePipes(MongoIdPipe)
  @Get('module/:id')
  async getCourseModule(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.getModuleById(id, token);
  }

  @ApiOperation({ summary: 'Change course module' })
  @ApiResponse({ status: 200, type: CourseModule })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch('module/:id')
  async changeCourseModule(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: ChangeCourseModuleDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.changeModule(id, dto, token);
  }

  @ApiOperation({ summary: 'Delete course module' })
  @ApiResponse({ status: 200, type: CourseModule })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Delete('module/:id')
  async removeCourseModule(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.removeModule(id, token);
  }

  @ApiOperation({ summary: 'Add lesson to course module' })
  @ApiResponse({ status: 200, type: CourseModule })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch('module/:id/lesson')
  async addLessonToCourseModule(
    @Req() req,
    @Param('id') id: string,
    @Query() query: AddLessonToCourseModuleQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.addLessonToModule(id, query['lesson-id'], token);
  }

  @ApiOperation({ summary: 'Remove lesson from course module' })
  @ApiResponse({ status: 200, type: CourseModule })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Delete('module/:id/lesson')
  async removeLessonFromCourseModule(
    @Req() req,
    @Param('id') id: string,
    @Query() query: AddLessonToCourseModuleQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.removeLessonFromModule(
      id,
      query['lesson-id'],
      token,
    );
  }

  // Courses

  @ApiOperation({ summary: 'Create course' })
  @ApiResponse({ status: 201, type: Course })
  @Roles(UserRoleEnum.PRODUCER)
  @Post()
  async createCourse(@Req() req, @Body() dto: CreateCourseDto) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.createCourse(dto, token);
  }

  @ApiOperation({ summary: 'Get course' })
  @ApiResponse({ status: 200, type: Course })
  @Roles(UserRoleEnum.USER)
  @UsePipes(MongoIdPipe)
  @Get(':id')
  async getCourse(
    @Req() req,
    @Param('id') id: string,
    @Query() query: GetCourseQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.getCourseWithUpdateId(id, token, query);
  }

  @ApiOperation({ summary: 'Change course' })
  @ApiResponse({ status: 200, type: Course })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch(':id')
  async changeCourse(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: ChangeCourseDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.changeCourse(id, dto, token);
  }

  @ApiOperation({ summary: 'Delete course' })
  @ApiResponse({ status: 200, type: Course })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Delete(':id')
  async removeCourse(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.removeCourse(id, token);
  }

  @ApiOperation({ summary: 'Add document to course' })
  @ApiResponse({ status: 200, type: Course })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch(':id/document')
  async addDocumentToCourse(
    @Req() req,
    @Param('id') id: string,
    @Query() query: AddDocumentToCourseLessonQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.addDocumentToCourse(
      id,
      query['document-id'],
      token,
    );
  }

  @ApiOperation({ summary: 'Remove document from course' })
  @ApiResponse({ status: 200, type: Course })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Delete(':id/document')
  async removeDocumentFromCourse(
    @Req() req,
    @Param('id') id: string,
    @Query() query: AddDocumentToCourseLessonQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.removeDocumentFromCourse(
      id,
      query['document-id'],
      token,
    );
  }

  @ApiOperation({ summary: 'Add module to course module' })
  @ApiResponse({ status: 200, type: Course })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch(':id/module')
  async addModuleToCourse(
    @Req() req,
    @Param('id') id: string,
    @Query() query: AddModuleToCourseCourseQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.addModuleToCourse(id, query['module-id'], token);
  }

  @ApiOperation({ summary: 'Remove module from course module' })
  @ApiResponse({ status: 200, type: Course })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Delete(':id/module')
  async removeModuleFromCourse(
    @Req() req,
    @Param('id') id: string,
    @Query() query: AddModuleToCourseCourseQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.removeModuleFromCourse(
      id,
      query['module-id'],
      token,
    );
  }

  @ApiOperation({ summary: 'Get courses' })
  @ApiResponse({ status: 200, type: RequestCourseArrayType })
  @Roles(UserRoleEnum.USER)
  @Get()
  async getCourses(@Req() req, @Query() query: GetCoursesQueryDto) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.getCourses(query, token);
  }

  @ApiOperation({ summary: 'Enroll  on course' })
  @ApiResponse({ status: 200, type: Course })
  @Roles(UserRoleEnum.USER)
  @UsePipes(MongoIdPipe)
  @Post(':id/enroll')
  async enrollOnCourse(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.enrollToCourse(id, token);
  }

  @ApiOperation({
    summary: 'Enroll  another user on course (method for owner)',
  })
  @ApiResponse({ status: 200, type: Course })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Post(':id/enroll-another-user')
  async enrollOnCourseAnotherUser(
    @Req() req,
    @Param('id') id: string,
    @Query() query: EnrollUserToCourseQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.enrollToCourseAnotherUser(id, query, token);
  }

  @ApiOperation({
    summary: 'Update course status',
  })
  @ApiResponse({ status: 200, type: Course })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch(':id/update-course-status')
  async updateCourseStatus(
    @Req() req,
    @Param('id') id: string,
    @Query() query: UpdateCourseStatusQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.courseService.changeCourseStatus(id, query.status, token);
  }
}
