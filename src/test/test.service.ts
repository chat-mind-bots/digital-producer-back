import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from 'src/test/schemas/question.schema';
import { Model, Types } from 'mongoose';
import { CreateQuestionDto } from 'src/test/dto/create-question.dto';
import { AuthService } from 'src/auth/auth.service';
import { ChangeQuestionDto } from 'src/test/dto/change-question.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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

  async actionQuestion(id: string, answer: string) {
    const question = await this.getQuestionById(id);
    return question.right_answer === answer;
  }
}
