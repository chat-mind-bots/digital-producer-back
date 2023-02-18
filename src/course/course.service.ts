import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CourseCategory,
  CourseCategoryDocument,
  CourseSubCategory,
  CourseSubCategoryDocument,
} from 'src/course/schemas/course-category.schema';
import { Model } from 'mongoose';
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
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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

  async getLessonById(id: string) {
    const lesson = await this.courseLessonModel
      .findById(id)
      .populate({
        path: 'owner',
        select: '_id first_name',
      })
      .populate('documents');
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

  async removeWithOutToken(id: string) {
    const lesson = await this.getLessonById(id);

    const { documents } = lesson;
    await this.documentService.deleteManyDocumentsWithOutToken(
      documents.map((doc) => String(doc)),
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
        `This lesson does not belong to the selected module`,
        HttpStatus.NOT_FOUND,
      );
    }
    const update = { $pull: { documents: documentId } };
    const result = await lesson.updateOne(update).exec();

    await this.documentService.deleteDocumentWithOutToken(documentId);
    return result;
  }

  // MODULES

  async getModuleById(id: string) {
    const module = await this.courseModuleModel
      .findById(id)
      .populate({
        path: 'owner',
        select: '_id first_name',
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

    return this.getModuleById(id);
  }

  async removeModule(id: string, token: string) {
    const { lessons } = await this.getModuleByIdWithTokenCheck(id, token);

    for (const lesson of lessons) {
      await this.removeWithOutToken(String(lesson._id));
    }

    const result = this.courseLessonModel.findByIdAndDelete(id);
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
}
