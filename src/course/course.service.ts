import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'lodash';
import {
  CourseCategory,
  CourseCategoryDocument,
  CourseSubCategory,
  CourseSubCategoryDocument,
} from 'src/course/schemas/course-category.schema';
import { Model, Types } from 'mongoose';
import { CreateCourseCategoryDto } from 'src/course/dto/category/create-course-category.dto';
import { CreateCourseSubCategoryDto } from 'src/course/dto/sub-category/create-course-sub-category.dto';
import { ChangeCourseCategoryDto } from 'src/course/dto/category/change-course-category.dto';
import { ChangeCourseSubCategoryDto } from 'src/course/dto/sub-category/change-course-sub-category.dto';
import {
  CourseLesson,
  CourseLessonDocument,
} from 'src/course/schemas/course-lesson.schema';
import {
  CourseModule,
  CourseModuleDocument,
} from 'src/course/schemas/course-module.schema';
import { CreateCourseLessonDto } from 'src/course/dto/lesson/create-course-lesson.dto';
import { ChangeCourseLessonDto } from 'src/course/dto/lesson/change-course-lesson.dto';
import { DocumentService } from 'src/document/document.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateCourseModuleDto } from 'src/course/dto/module/create-course-module.dto';
import { ChangeCourseModuleDto } from 'src/course/dto/module/change-course-module.dto';
import { Course, CourseDocument } from 'src/course/schemas/course.schema';
import { CreateCourseDto } from 'src/course/dto/course/create-course.dto';
import { TagsService } from 'src/tags/tags.service';
import { ChangeCourseDto } from 'src/course/dto/course/change-course.dto';
import { GetCoursesQueryDto } from 'src/course/dto/query/get-courses-query.dto';
import { TestService } from 'src/test/test.service';
import { EnrollUserToCourseQueryDto } from 'src/course/dto/query/enroll-user-to-course-query.dto';
import { CurseStatusEnum } from 'src/course/enum/curse-status.enum';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { GetCourseQueryDto } from 'src/course/dto/query/get-course-query.dto';
import { BotService } from 'src/bot/bot.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(CourseCategory.name)
    private readonly courseCategoryModel: Model<CourseCategoryDocument>,
    @InjectModel(CourseSubCategory.name)
    private readonly courseSubCategoryModel: Model<CourseSubCategoryDocument>,
    @InjectModel(CourseLesson.name)
    private readonly courseLessonModel: Model<CourseLessonDocument>,
    @InjectModel(CourseModule.name)
    private readonly courseModuleModel: Model<CourseModuleDocument>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    @Inject(forwardRef(() => TestService))
    private readonly testService: TestService,
    @Inject(forwardRef(() => BotService))
    private readonly botService: BotService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  // CATEGORIES
  async getCategoryByIdWithOutSubCategories(id: string) {
    const category = await this.courseCategoryModel.findById(id);
    if (!category) {
      throw new HttpException(
        'Document (Course Category) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  async getCategoryById(id: string) {
    const category = await this.courseCategoryModel.findById(id);
    if (!category) {
      throw new HttpException(
        'Document (Course Category) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const subCategories = await this.courseSubCategoryModel
      .find({ category: category._id })
      .exec();
    return { ...category.toObject(), sub_categories: subCategories };
  }

  async createCategory(dto: CreateCourseCategoryDto) {
    const category = await this.courseCategoryModel.create({ ...dto });
    return this.getCategoryById(category._id);
  }

  async changeCategory(id: string, dto: ChangeCourseCategoryDto) {
    const category = await this.getCategoryByIdWithOutSubCategories(id);
    await category.updateOne({ ...dto });
    return this.getCategoryById(category._id);
  }

  async getCategories() {
    const categories = await this.courseCategoryModel.find().exec();

    const publishersWithGames = await Promise.all(
      categories.map(async (category) => {
        const subCategories = await this.courseSubCategoryModel
          .find({ category: category._id })
          .exec();

        return {
          ...category.toObject(),
          sub_categories: subCategories,
        };
      }),
    );

    const total = await this.courseCategoryModel.countDocuments().exec();
    return {
      data: publishersWithGames,
      total,
    };
  }

  async removeCategory(id: string) {
    const result = this.courseCategoryModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpException(
        'Document (Category category) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }

  // SUB-CATEGORIES

  async getSubCategoryById(id: string) {
    const subCategory = await this.courseSubCategoryModel.findById(id);
    if (!subCategory) {
      throw new HttpException(
        'Document (Course SubCategory) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return subCategory;
  }

  async createSubCategory(dto: CreateCourseSubCategoryDto) {
    const { category_id, ...otherDto } = dto;
    const category = await this.getCategoryById(category_id);
    const subCategory = await this.courseSubCategoryModel.create({
      ...otherDto,
      category: category._id,
    });
    return this.getSubCategoryById(subCategory._id);
  }

  async changeSubCategory(id: string, dto: ChangeCourseSubCategoryDto) {
    const { category_id, ...otherDto } = dto;
    const category = category_id
      ? await this.getCategoryById(category_id)
      : undefined;
    const update = category_id
      ? { ...otherDto, category: category._id }
      : { ...otherDto };
    const subCategory = await this.courseSubCategoryModel
      .findByIdAndUpdate(id, update)
      .lean();
    return this.getSubCategoryById(subCategory._id);
  }

  async getSubCategories() {
    const subCategories = await this.courseSubCategoryModel.find();
    const total = await this.courseSubCategoryModel.countDocuments().exec();
    return {
      data: subCategories,
      total,
    };
  }

  async removeSubCategory(id: string) {
    const result = this.courseSubCategoryModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpException(
        'Document (Course SubCategory) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }

  // LESSONS

  async getLessonByIdWithTest(id: string, token: string) {
    const lesson = await this.courseLessonModel
      .findById(id)
      .populate({
        path: 'owner',
        select: '_id first_name username photos',
      })
      .populate('documents')
      .lean()
      .exec();

    if (!lesson) {
      throw new HttpException(
        'Document (Course Lesson) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      ...lesson,
      test: await this.testService.getTestByLessonId(id),
      ...(await this.testService.getUserProgress(id, token)),
    };
  }

  async getLessonById(id: string) {
    const lesson = await this.courseLessonModel
      .findById(id)
      .populate({
        path: 'owner',
        select: '_id first_name username photos',
      })
      .populate('documents');
    // .populate({
    //   path: 'tests',
    //   select: '-right_answer',
    // });
    if (!lesson) {
      throw new HttpException(
        'Document (Course Lesson) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return lesson;
  }

  async getLessonByIdWithTokenCheck(id: string, token: string) {
    const { _id } = await this.authService.getUserInfo(token);
    const lesson = await this.getLessonById(id);

    if (String(_id) !== String(lesson.owner._id)) {
      throw new HttpException(
        `You not owner of this lesson`,
        HttpStatus.FORBIDDEN,
      );
    }

    return lesson;
  }

  async createLesson(dto: CreateCourseLessonDto, token: string) {
    const { _id } = await this.authService.getUserInfo(token);
    const lesson = await this.courseLessonModel.create({
      ...dto,
      owner: _id,
      documents: [],
    });
    return this.getLessonById(lesson._id);
  }

  async changeLesson(id: string, dto: ChangeCourseLessonDto, token: string) {
    const lesson = await this.getLessonByIdWithTokenCheck(id, token);

    await lesson.updateOne({ ...dto });
    const module = await this.findModuleByLesson(id);

    const course = await this.findCourseByModule(String(module._id));
    await course.updateOne({ status: CurseStatusEnum.IN_PROGRESS });

    return this.getLessonById(id);
  }

  async removeLesson(id: string, token: string) {
    const lesson = await this.getLessonByIdWithTokenCheck(id, token);

    const { documents } = lesson;
    await this.documentService.deleteManyDocumentsWithOutToken(
      documents.map(({ _id }) => String(_id)),
    );

    const result = await lesson.remove();
    return result;
  }

  async removeLessonWithOutToken(id: string) {
    const lesson = await this.getLessonById(id);

    const { documents } = lesson;
    await this.documentService.deleteManyDocumentsWithOutToken(
      documents.map(({ _id }) => String(_id)),
    );

    const result = await lesson.remove();
    return result;
  }

  async addDocumentToLesson(id: string, documentId: string, token: string) {
    const lesson = await this.getLessonByIdWithTokenCheck(id, token);

    if (
      lesson.documents.some(({ _id }) => String(_id) === String(documentId))
    ) {
      throw new HttpException(
        `This document has already been assigned to a lesson before`,
        HttpStatus.NOT_FOUND,
      );
    }
    const document = await this.documentService.getDocumentById(documentId);
    await lesson.updateOne({ documents: [...lesson.documents, document._id] });
    return this.getLessonById(id);
  }

  async removeDocumentFromLesson(
    id: string,
    documentId: string,
    token: string,
  ) {
    const lesson = await this.getLessonByIdWithTokenCheck(id, token);

    if (
      !lesson.documents.some(({ _id }) => String(_id) === String(documentId))
    ) {
      throw new HttpException(
        `This document does not belong to the selected document`,
        HttpStatus.NOT_FOUND,
      );
    }
    const update = { $pull: { documents: documentId } };
    const result = await lesson.updateOne(update).exec();

    await this.documentService.deleteDocumentWithOutToken(documentId);
    return result;
  }

  // async addTestToLesson(
  //   id: string,
  //   query: AddTestToCourseLessonQueryDto,
  //   token: string,
  // ) {
  //   const lesson = await this.getLessonByIdWithTokenCheck(id, token);
  //
  //   const ids = [];
  //
  //   if (query['test-id']) {
  //     const testIdsArray = Array.isArray(query['test-id'])
  //       ? query['test-id']
  //       : [query['test-id']];
  //
  //     ids.push(...testIdsArray);
  //   }
  //
  //   const testIds = (
  //     await this.testService.getQuestionsIdsWithToken(ids, token)
  //   ).map(({ _id }) => String(_id));
  //
  //   const testIdsArray = sortBy(
  //     unionBy(
  //       testIds,
  //       lesson.tests.map(({ _id }) => String(_id)),
  //       (item) => item,
  //     ),
  //   );
  //
  //   await lesson.updateOne({
  //     tests: [...testIdsArray.map((id) => new Types.ObjectId(id))],
  //   });
  //
  //   return this.getLessonById(id);
  // }

  // async removeTestFromLesson(id: string, testId: string, token: string) {
  //   const lesson = await this.getLessonByIdWithTokenCheck(id, token);
  //
  //   await this.testService.getQuestionWithToken(testId, token);
  //
  //   if (!lesson.tests.some(({ _id }) => String(_id) === String(testId))) {
  //     throw new HttpException(
  //       `This test does not belong to the selected document`,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //
  //   const update = { $pull: { tests: testId } };
  //   const result = await lesson.updateOne(update).exec();
  //
  //   await this.testService.removeQuestion(testId, token);
  //   return result;
  // }

  // MODULES

  async getModuleById(id: string) {
    const module = await this.courseModuleModel
      .findById(id)
      .populate({
        path: 'owner',
        select: '_id first_name username photos',
      })
      .populate({
        path: 'lessons',
        select: '_id name image level_difficulty logic_number',
      });

    if (!module) {
      throw new HttpException(
        'Document (Course Module) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return module;
  }

  async getModuleByIdWithTokenCheck(id: string, token: string) {
    const { _id } = await this.authService.getUserInfo(token);
    const module = await this.getModuleById(id);

    if (String(_id) !== String(module.owner._id)) {
      throw new HttpException(
        `You not owner of this module`,
        HttpStatus.FORBIDDEN,
      );
    }
    return module;
  }

  async createModule(dto: CreateCourseModuleDto, token: string) {
    const { _id } = await this.authService.getUserInfo(token);

    const module = await this.courseModuleModel.create({ ...dto, owner: _id });
    return this.getModuleById(module._id);
  }

  async changeModule(id: string, dto: ChangeCourseModuleDto, token: string) {
    const module = await this.getModuleByIdWithTokenCheck(id, token);

    await module.updateOne({ ...dto });

    const course = await this.findCourseByModule(id);
    await course.updateOne({ status: CurseStatusEnum.IN_PROGRESS });
    return this.getModuleById(id);
  }

  async removeModule(id: string, token: string) {
    const { lessons } = await this.getModuleByIdWithTokenCheck(id, token);

    for (const lesson of lessons) {
      await this.removeLessonWithOutToken(String(lesson._id));
    }

    const result = this.courseModuleModel.findByIdAndDelete(id);
    return result;
  }

  async addLessonToModule(id: string, lessonId: string, token: string) {
    const module = await this.getModuleByIdWithTokenCheck(id, token);

    if (module.lessons.some(({ _id }) => String(_id) === String(lessonId))) {
      throw new HttpException(
        `This lesson has already been assigned to a lesson before`,
        HttpStatus.NOT_FOUND,
      );
    }

    const lesson = await this.getLessonById(lessonId);
    await module.updateOne({ lessons: [...module.lessons, lesson._id] });
    return this.getModuleById(id);
  }

  async removeLessonFromModule(id: string, lessonId: string, token: string) {
    const module = await this.getModuleByIdWithTokenCheck(id, token);

    if (!module.lessons.some(({ _id }) => String(_id) === String(lessonId))) {
      throw new HttpException(
        `This lesson does not belong to the selected module`,
        HttpStatus.NOT_FOUND,
      );
    }

    const update = { $pull: { lessons: lessonId } };
    await module.updateOne(update).exec();

    await this.removeLessonWithOutToken(lessonId);

    return this.getModuleById(id);
  }

  // COURSES

  async getCourseById(id: string) {
    const course = await this.courseModel
      .findById(id)
      .populate({
        path: 'owner',
        select: '_id first_name username photos',
      })
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons',
          select: '_id name image level_difficulty logic_number',
        },
      })
      .populate('tags')
      .populate('documents');

    if (!course) {
      throw new HttpException(
        'Document (Course) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async getCourseWithUpdateId(
    id: string,
    token: string,
    query: GetCourseQueryDto,
  ) {
    const course = await this.courseModel
      .findById(id)
      .populate({
        path: 'owner',
        select: '_id first_name username username photos',
      })
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons',
          select: '_id name image level_difficulty logic_number',
        },
      })
      .populate('tags')
      .populate('documents')
      .populate('sub_category')
      .lean()
      .exec();

    if (!course) {
      throw new HttpException(
        'Document (Course) not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const { _id, role } = await this.authService.getUserInfo(token);

    const students =
      String(_id) === String(course.owner._id) ||
      role.includes(UserRoleEnum.ADMIN)
        ? await this.getStudentsWithTotal(
            id,
            query['students-offset'],
            query['students-limit'],
          )
        : {};

    return {
      ...(String(_id) === String(course.owner._id) ||
      role.includes(UserRoleEnum.ADMIN)
        ? { ...course, ...students }
        : omit(course, ['students'])),
      is_enrolled: !!course.students?.some(
        (st_id) => String(st_id) === String(_id),
      ),
      category: (course.sub_category as unknown as CourseSubCategory)?.category,
      sub_category: course.sub_category?._id,
    };
  }

  async getStudentsWithTotal(
    courseId: string,
    offset = 0,
    limit = 15,
  ): Promise<{ students: any[]; students_total: number }> {
    const [course, students_total] = await Promise.all([
      this.courseModel
        .findById(courseId, {
          students: { $slice: [offset, limit] },
        })
        .populate({
          path: 'students',
          select: '_id first_name username photos',
        }),
      this.courseModel
        .aggregate([
          {
            $match: { _id: new Types.ObjectId(courseId) },
          },
          {
            $project: {
              students_total: { $size: '$students' },
            },
          },
        ])
        .exec(),
    ]);
    return {
      students: course?.students ?? [],
      students_total: students_total[0]?.students_total ?? 0,
    };
    // const [students, students_total] = await Promise.all([
    //   this.courseModel
    //     .find({}, { students: { $slice: [offset, limit] }, _id: 0, title: 0 })
    //     .distinct('students'),
    //   this.courseModel
    //     .aggregate([
    //       {
    //         $project: {
    //           students_total: { $size: '$students' },
    //         },
    //       },
    //     ])
    //     .exec(),
    // ]);
    // return { students, students_total: students_total[0]?.students_total ?? 0 };

    // const [students, students_total] = await Promise.all([
    //   this.courseModel
    //     .find({}, { students: { $slice: [offset, limit] } })
    //     .populate({
    //       path: 'students',
    //       select: '_id first_name username photos',
    //     })
    //     .exec(),
    //   this.courseModel.countDocuments().exec(),
    // ]);
    // return { students, students_total };
  }

  async getCourseByIdWithTokenCheck(id: string, token: string) {
    const { _id } = await this.authService.getUserInfo(token);
    const course = await this.getCourseById(id);

    if (String(_id) !== String(course.owner._id)) {
      throw new HttpException(
        `You not owner of this module`,
        HttpStatus.FORBIDDEN,
      );
    }

    return course;
  }

  async createCourse(dto: CreateCourseDto, token: string) {
    const { _id } = await this.authService.getUserInfo(token);
    const { tags: tagsDto, sub_category, ...otherDto } = dto;

    const { _id: subCategoryId } = await this.getSubCategoryById(sub_category);
    const tagsFromDB = await this.tagsService.createManyTags(tagsDto);
    const tags = [];
    for (const tag of tagsFromDB) {
      tags.push(tag._id);
    }

    const course = await this.courseModel.create({
      ...otherDto,
      owner: _id,
      sub_category: subCategoryId,
      tags,
    });
    return this.getCourseById(course._id);
  }

  async changeCourse(id: string, dto: ChangeCourseDto, token: string) {
    const course = await this.getCourseByIdWithTokenCheck(id, token);

    const { tags: tagsDto, ...otherDto } = dto;

    if (course.status === CurseStatusEnum.IN_REVIEW) {
      throw new HttpException(
        `It is not possible to edit the course while it is being checked`,
        HttpStatus.FORBIDDEN,
      );
    }
    if (tagsDto) {
      const tagsFromDB = await this.tagsService.createManyTags(tagsDto);
      const tags = [];
      for (const tag of tagsFromDB) {
        tags.push(tag._id);
      }
      await course.updateOne({
        ...otherDto,
        tags,
        status: CurseStatusEnum.IN_PROGRESS,
      });
    } else {
      await course.updateOne(otherDto);
    }

    return this.getCourseById(id);
  }

  async removeCourse(id: string, token: string) {
    const { documents, modules } = await this.getCourseByIdWithTokenCheck(
      id,
      token,
    );

    await this.documentService.deleteManyDocumentsWithOutToken(
      documents.map(({ _id }) => String(_id)),
    );

    for (const { _id } of modules) {
      await this.removeModule(String(_id), token);
    }

    const result = this.courseModel.findByIdAndDelete(id);
    return result;
  }

  async addDocumentToCourse(id: string, documentId: string, token: string) {
    const course = await this.getCourseByIdWithTokenCheck(id, token);

    if (
      course.documents.some(({ _id }) => String(_id) === String(documentId))
    ) {
      throw new HttpException(
        `This document has already been assigned to a course before`,
        HttpStatus.NOT_FOUND,
      );
    }

    const document = await this.documentService.getDocumentById(documentId);
    await course.updateOne({ documents: [...course.documents, document._id] });
    return this.getCourseById(id);
  }

  async removeDocumentFromCourse(
    id: string,
    documentId: string,
    token: string,
  ) {
    const course = await this.getCourseByIdWithTokenCheck(id, token);

    if (
      !course.documents.some(({ _id }) => String(_id) === String(documentId))
    ) {
      throw new HttpException(
        `This course does not belong to the selected document`,
        HttpStatus.NOT_FOUND,
      );
    }
    const update = { $pull: { documents: documentId } };
    const result = await course.updateOne(update).exec();

    await this.documentService.deleteDocumentWithOutToken(documentId);
    return this.getCourseById(id);
  }

  async addModuleToCourse(id: string, moduleId: string, token: string) {
    const course = await this.getCourseByIdWithTokenCheck(id, token);

    if (course.modules.some(({ _id }) => String(_id) === String(moduleId))) {
      throw new HttpException(
        `This module has already been assigned to a course before`,
        HttpStatus.NOT_FOUND,
      );
    }

    const module = await this.getModuleByIdWithTokenCheck(moduleId, token);

    await course.updateOne({ modules: [...course.modules, module._id] });
    return this.getCourseById(id);
  }

  async removeModuleFromCourse(id: string, moduleId: string, token: string) {
    const course = await this.getCourseByIdWithTokenCheck(id, token);

    if (!course.modules.some(({ _id }) => String(_id) === String(moduleId))) {
      throw new HttpException(
        `This course does not belong to the selected module`,
        HttpStatus.NOT_FOUND,
      );
    }
    const update = { $pull: { modules: moduleId } };
    await course.updateOne(update).exec();

    await this.removeModule(moduleId, token);
    return this.getCourseById(id);
  }

  async getCourses(query: GetCoursesQueryDto, token: string) {
    const { _id, role } = await this.authService.getUserInfo(token);
    const filter = { status: CurseStatusEnum.AVAILABLE };
    const sort = {};
    if (query['sub-category-id']) {
      const subCategoriesIdsArray = Array.isArray(query['sub-category-id'])
        ? query['sub-category-id']
        : [query['sub-category-id']];
      filter['sub_category'] = {
        $in: subCategoriesIdsArray.map(
          (subCatId) => new Types.ObjectId(subCatId),
        ),
      };
    }
    if (query['owner-id']) {
      const ownerIdsArray = Array.isArray(query['owner-id'])
        ? query['owner-id']
        : [query['owner-id']];

      if (ownerIdsArray.some((id) => String(id) === String(_id))) {
        delete filter.status;
      }
      filter['owner'] = {
        $in: ownerIdsArray.map((ownerId) => new Types.ObjectId(ownerId)),
      };
    }
    if (query['enrolled-user-id']) {
      const ownerIdsArray = Array.isArray(query['enrolled-user-id'])
        ? query['enrolled-user-id']
        : [query['enrolled-user-id']];

      filter['students'] = {
        $in: ownerIdsArray.map((ownerId) => new Types.ObjectId(ownerId)),
      };
    }
    if (query.q) {
      filter['$or'] = [{ name: { $regex: query.q, $options: 'i' } }];
    }
    if (query['sort-by']) {
      sort[query['sort-by']] = query['sort-order'] === 'asc' ? 1 : -1;
    }
    if (query['status']) {
      if (role.some((role) => role === UserRoleEnum.ADMIN)) {
        filter['status'] = query['status'];
      } else if (
        filter['owner']?.$in?.some((id) => String(id) === String(_id))
      ) {
        filter['status'] = query['status'];
      } else {
        throw new HttpException(
          `You cannot use status filter, because you are not admin or owner of course`,
          HttpStatus.FORBIDDEN,
        );
      }
    }
    if (query['hide-bought']) {
      filter['students'] = {
        ...filter['students'],
        $nin: [new Types.ObjectId(_id)],
      };
    }
    const courses = await this.courseModel
      .find({ ...filter })
      .limit(query.limit)
      .skip(query.offset)
      .sort({ ...sort })
      .select(
        '_id name description level_difficulty image is_free tags  students status',
      )
      .populate('tags')
      .lean()
      .exec();

    const total = await this.courseModel.countDocuments({ ...filter }).exec();

    return {
      data: courses.map((course) => ({
        ...omit(course, ['students']),
        is_enrolled: !!course.students?.some(
          (st_id) => String(st_id) === String(_id),
        ),
      })),
      total,
    };
  }

  async findCourseByModule(moduleId: string) {
    const course = await this.courseModel.findOne({
      modules: { $in: [new Types.ObjectId(moduleId)] },
    });
    return course;
  }

  async findModuleByLesson(LessonId: string) {
    const module = await this.courseModuleModel.findOne({
      lessons: { $in: [new Types.ObjectId(LessonId)] },
    });
    return module;
  }
  async enrollToCourse(id: string, token: string) {
    const { _id } = await this.authService.getUserInfo(token);

    const course = await this.getCourseById(id);

    if (String(course.owner._id) === String(_id)) {
      throw new HttpException(
        `You cannot enroll in a course if you own it`,
        HttpStatus.FORBIDDEN,
      );
    }
    if (course.students.some((id) => String(id) === String(_id))) {
      throw new HttpException(
        `You were previously enrolled in the course`,
        HttpStatus.FORBIDDEN,
      );
    }

    await course.updateOne({ $addToSet: { students: _id } });

    return this.getCourseById(id);
  }

  async enrollToCourseAnotherUser(
    id: string,
    query: EnrollUserToCourseQueryDto,
    token: string,
  ) {
    const { _id } = await this.authService.getUserInfo(token);
    const course = await this.getCourseById(id);

    if (String(course.owner._id) !== String(_id)) {
      throw new HttpException(
        `You can't sign people up for this course because you don't own it`,
        HttpStatus.FORBIDDEN,
      );
    }
    const userIdsArray = [];

    if (query['user-id']) {
      userIdsArray.push(
        ...(Array.isArray(query['user-id'])
          ? query['user-id']
          : [query['user-id']]),
      );
    }

    userIdsArray.forEach((_id) => {
      if (String(course.owner._id) === String(_id)) {
        throw new HttpException(
          `You cannot enroll in a course if you own it. Problem id is - ${_id}`,
          HttpStatus.FORBIDDEN,
        );
      }
      if (course.students.some((id) => String(id) === String(_id))) {
        throw new HttpException(
          `You were previously enrolled in the course. Problem id is - ${_id}`,
          HttpStatus.FORBIDDEN,
        );
      }
    });

    await course.updateOne({
      $addToSet: { students: userIdsArray.map((id) => new Types.ObjectId(id)) },
    });

    for (const userId of userIdsArray) {
      const user = await this.userService.findById(userId);
      if (user) {
        await this.botService.sendMessage(
          user.tg_id,
          `Вы были добавлены на курс - ${course.name}`,
          false,
        );
      }
    }

    return this.getCourseById(id);
  }

  async changeCourseStatus(id: string, status: CurseStatusEnum, token: string) {
    const user = await this.authService.getUserInfo(token);
    const course = await this.getCourseById(id);

    if (user.role.some((role) => role === UserRoleEnum.ADMIN)) {
      await course.updateOne({ status });
      return this.getCourseById(id);
    }
    if (String(course.owner._id) !== String(user._id)) {
      throw new HttpException(
        `You are can not update course status, because you are not owner of this course`,
        HttpStatus.FORBIDDEN,
      );
    }
    if (course.status === CurseStatusEnum.IN_REVIEW) {
      throw new HttpException(
        `You are can not update course status, because now course in review`,
        HttpStatus.FORBIDDEN,
      );
    }
    if (status === CurseStatusEnum.APPROVED) {
      throw new HttpException(
        `You are can not update course status to APPROVED, because you are not admin`,
        HttpStatus.FORBIDDEN,
      );
    }

    await course.updateOne({ status });
    return this.getCourseById(id);
  }
}
