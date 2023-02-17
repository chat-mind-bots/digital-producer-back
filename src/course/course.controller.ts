import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { CreateCourseCategoryDto } from 'src/course/dto/create-course-category.dto';
import {
  CourseCategory,
  CourseSubCategory,
} from 'src/course/schemas/course-category.schema';
import { Public } from 'src/auth/public-route.decorator';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { RequestCourseCategoriesArrayType } from 'src/course/type/request-course-categories-array.type';
import { CreateCourseSubCategoryDto } from 'src/course/dto/create-course-sub-category.dto';
import { RequestCourseSubCategoriesArrayType } from 'src/course/type/request-course-sub-categories-array.type';
import { ChangeCourseCategoryDto } from 'src/course/dto/change-course-category.dto';
import { ChangeCourseSubCategoryDto } from 'src/course/dto/change-course-sub-category.dto';

@Controller('course')
@ApiTags('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
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
}
