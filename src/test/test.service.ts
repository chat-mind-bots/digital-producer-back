import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEqual, omit, sortBy } from 'lodash';
import { Question, QuestionDocument } from 'src/test/schemas/question.schema';
import { Model, Types } from 'mongoose';
import { CreateQuestionDto } from 'src/test/dto/create-question.dto';
import { AuthService } from 'src/auth/auth.service';
import { ChangeQuestionDto } from 'src/test/dto/change-question.dto';
import {
  IProgressAnswer,
  Test,
  TestDocument,
} from 'src/test/schemas/test.schema';
import { ChangeTestDto } from 'src/test/dto/change-test.dto';
import { CreateTestDto } from 'src/test/dto/create-test.dto';
import { AddQuestionToTestQueryDto } from 'src/test/dto/query/add-question-to-test-query.dto';
import { CourseService } from 'src/course/course.service';
import { AddProgressToTestDto } from 'src/test/dto/add-progress-to-test.dto';
import { ProgressStatusEnum } from 'src/test/enum/progress-status.enum';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(Test.name)
    private readonly testModel: Model<TestDocument>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
  ) {}

  async getQuestionById(id: string) {
    const question = await this.questionModel.findById(id).populate({
      path: 'owner',
      select: '_id first_name photos',
    });
    if (!question) {
      throw new HttpException(
        'Document (Question) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return question;
  }

  async getQuestionsIdsWithToken(ids: string[], token) {
    const { _id } = await this.authService.getUserInfo(token);
    const filter = {
      _id: {
        $in: ids.map((id) => new Types.ObjectId(id)),
      },
      owner: _id,
    };
    return this.questionModel
      .find({ ...filter })
      .select('_id')
      .exec();
  }
  async getQuestionWithToken(id: string, token: string) {
    const { _id } = await this.authService.getUserInfo(token);
    const question = await this.getQuestionById(id);

    if (String(_id) !== String(question.owner._id)) {
      throw new HttpException(
        `You not owner of this question`,
        HttpStatus.FORBIDDEN,
      );
    }

    return question;
  }
  async getQuestionWithOutRightAnswer(id: string) {
    const question = await this.questionModel
      .findById(id)
      .select('-right_answer -right_answers');

    if (!question) {
      throw new HttpException(
        'Document (Question) not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return question;
  }

  async createQuestion(dto: CreateQuestionDto, token) {
    const { _id } = await this.authService.getUserInfo(token);

    const question = await this.questionModel.create({ ...dto, owner: _id });
    return this.getQuestionById(question._id);
  }

  async changeQuestion(id: string, dto: ChangeQuestionDto, token: string) {
    const question = await this.getQuestionWithToken(id, token);

    await question.updateOne({ ...dto });
    return this.getQuestionById(id);
  }

  async removeQuestion(id: string, token: string) {
    const question = await this.getQuestionWithToken(id, token);

    const result = await question.remove();
    return result;
  }

  // async actionQuestion(id: string, answer: string) {
  //   const question = await this.getQuestionById(id);
  //   return question.right_answer === answer;
  // }
  async getTestById(id: string) {
    const test = await this.testModel
      .findById(id)
      .select('-progress')
      .populate({ path: 'owner', select: '_id first_name photos' })
      .populate({ path: 'questions' })
      .exec();
    if (!test) {
      throw new HttpException(
        'Document (Test) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return test;
  }

  async getTestByIdForUser(id: string) {
    // const { _id } = await this.authService.getUserInfo(token);

    const test = await this.testModel
      .findById(id)
      .select('-progress')
      .populate({ path: 'owner', select: '_id first_name photos' })
      .populate({ path: 'questions', select: '-right_answer -right_answers' })
      .exec();

    if (!test) {
      throw new HttpException(
        'Document (Test) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    // if (String(_id) !== String(test.owner._id)) {
    //   throw new HttpException(
    //     'You are not owner of this test',
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    return test;
  }

  async getTestByIdWithTokenCheck(id: string, token: string) {
    const { _id } = await this.authService.getUserInfo(token);

    const test = await this.getTestById(id);

    if (String(_id) !== String(test.owner._id)) {
      throw new HttpException(
        'You are not owner of this test',
        HttpStatus.FORBIDDEN,
      );
    }

    return test;
  }

  async createTest(dto: CreateTestDto, token: string) {
    const { _id } = await this.authService.getUserInfo(token);

    const { lesson_id } = dto;

    const lesson = await this.courseService.getLessonById(lesson_id);

    const test = await this.testModel.create({
      ...dto,
      owner: _id,
      lesson: lesson._id,
    });

    return this.getTestById(test._id);
  }

  async changeTest(id: string, dto: ChangeTestDto, token: string) {
    const { _id } = await this.authService.getUserInfo(token);
    const test = await this.getTestById(id);

    const update = { ...omit(dto, 'lesson_id') };

    const { lesson_id } = dto;
    if (lesson_id) {
      const lesson = await this.courseService.getLessonById(lesson_id);
      update['lesson'] = lesson._id;
    }

    if (String(_id) !== String(test.owner._id)) {
      throw new HttpException(
        'You are not owner of this test',
        HttpStatus.FORBIDDEN,
      );
    }
    await test.updateOne({ ...update });

    return this.getTestById(id);
  }

  async addQuestionToTest(
    id: string,
    query: AddQuestionToTestQueryDto,
    token: string,
  ) {
    const { _id } = await this.authService.getUserInfo(token);

    const test = await this.getTestById(id);

    if (String(_id) !== String(test.owner._id)) {
      throw new HttpException(
        'You are not owner of this test',
        HttpStatus.FORBIDDEN,
      );
    }

    const questionIds = Array.isArray(query['question-id'])
      ? query['question-id']
      : [query['question-id']];

    for (const questionId of questionIds) {
      const question = await this.getQuestionById(questionId);

      if (String(question.owner._id) !== String(_id)) {
        throw new HttpException(
          'You are not owner of this quest',
          HttpStatus.FORBIDDEN,
        );
      }
      if (
        test.questions.some((que) => String(que._id) === String(questionId))
      ) {
        throw new HttpException(
          `You already added this question to the test. Problem id is - ${questionId}`,
          HttpStatus.FORBIDDEN,
        );
      }
    }

    await test.updateOne({
      $addToSet: {
        questions: questionIds.map((que) => new Types.ObjectId(que)),
      },
    });
    return this.getTestById(id);
  }

  async removeQuestionFromTest(
    id: string,
    query: AddQuestionToTestQueryDto,
    token: string,
  ) {
    const { _id } = await this.authService.getUserInfo(token);

    const test = await this.getTestById(id);

    if (String(_id) !== String(test.owner._id)) {
      throw new HttpException(
        'You are not owner of this test',
        HttpStatus.FORBIDDEN,
      );
    }

    const questionIds = Array.isArray(query['question-id'])
      ? query['question-id']
      : [query['question-id']];

    for (const questionId of questionIds) {
      const question = await this.getQuestionById(questionId);

      if (String(question.owner._id) !== String(_id)) {
        throw new HttpException(
          'You are not owner of this quest',
          HttpStatus.FORBIDDEN,
        );
      }
      if (
        !test.questions.some((que) => String(que._id) === String(questionId))
      ) {
        throw new HttpException(
          `The question you are trying to delete does not belong in this test. Problem id is - ${questionId}`,
          HttpStatus.FORBIDDEN,
        );
      }
    }

    await test.updateOne({
      $pull: {
        questions: questionIds.map((que) => new Types.ObjectId(que)),
      },
    });
    return this.getTestById(id);
  }

  async getTestByLessonId(id: string) {
    const test = await this.testModel
      .findOne({ lesson: new Types.ObjectId(String(id)) })
      .select('-progress')
      .populate({ path: 'owner', select: '_id first_name photos' })
      .populate({ path: 'questions', select: '-right_answer -right_answers' })
      .exec();

    return test;
  }

  async answerCheck(answer: IProgressAnswer) {
    const question = await this.getQuestionById(answer.question);

    const { answer_key } = answer;

    if (question.is_multiply) {
      const sortedArray1 = sortBy(question.right_answers);
      const sortedArray2 = sortBy(answer_key);

      return isEqual(
        omit(sortedArray1, ['length']),
        omit(sortedArray2, ['length']),
      );
    }
    return answer_key.some((key) => key === question.right_answer);
  }

  async addProgressToTest(
    id: string,
    dto: AddProgressToTestDto,
    token: string,
  ) {
    const { _id: userId } = await this.authService.getUserInfo(token);

    const { status, duration, answers } = dto;

    const test = await this.testModel.findById(id).select('progress').exec();

    if (!test) {
      throw new HttpException(
        'Document (Test) not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const progressIndex = test.progress.findIndex(
      (p) => p.user.toString() === userId.toString(),
    );

    const doneAnswers: IProgressAnswer[] = [];
    // const resultObj = {};
    let resultCounter = 0;
    if (status === ProgressStatusEnum.DONE) {
      for (const answer of answers) {
        const result = await this.answerCheck(answer);
        if (result) {
          resultCounter++;
        }
        doneAnswers.push({ ...answer, result });
      }
    }
    if (progressIndex !== -1) {
      await this.testModel
        .updateOne(
          { _id: id },
          {
            $set: {
              [`progress.${progressIndex}.status`]: status,
              [`progress.${progressIndex}.duration`]: duration,
              ...(status === ProgressStatusEnum.DONE
                ? { [`progress.${progressIndex}.result`]: resultCounter }
                : {}),
              [`progress.${progressIndex}.answers`]:
                status === ProgressStatusEnum.DONE ? doneAnswers : answers,
            },
          },
        )
        .exec();
    } else {
      const newProgress = {
        user: new Types.ObjectId(userId),
        status,
        duration,
        ...(status === ProgressStatusEnum.DONE
          ? { result: resultCounter }
          : {}),
        answers: status === ProgressStatusEnum.DONE ? doneAnswers : answers,
      };
      await this.testModel
        .updateOne({ _id: id }, { $push: { progress: newProgress } })
        .exec();
    }

    const updatedTest = await this.testModel
      .findById(id)
      .select({ progress: { $elemMatch: { user: userId } } })
      .exec();

    return updatedTest.progress[0];
  }

  // await test.updateOne({ $addToSet: { progress: dto }})
  // }
}
