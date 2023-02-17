import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CourseCategory,
  CourseCategoryDocument,
  CourseSubCategory,
  CourseSubCategoryDocument,
} from 'src/course/schemas/course-category.schema';
import { Model } from 'mongoose';
import { CreateCourseCategoryDto } from 'src/course/dto/create-course-category.dto';
import { CreateCourseSubCategoryDto } from 'src/course/dto/create-course-sub-category.dto';
import { ChangeCourseCategoryDto } from 'src/course/dto/change-course-category.dto';
import { ChangeCourseSubCategoryDto } from 'src/course/dto/change-course-sub-category.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(CourseCategory.name)
    private readonly courseCategoryModel: Model<CourseCategoryDocument>,
    @InjectModel(CourseSubCategory.name)
    private readonly courseSubCategoryModel: Model<CourseSubCategoryDocument>,
  ) {}

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
        'Document (Category SubCategory) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}
