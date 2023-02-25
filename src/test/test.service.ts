import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Test, TestDocument } from 'src/test/test.schema';
import { Model, Types } from 'mongoose';
import { CreateTestDto } from 'src/test/dto/create-test.dto';
import { AuthService } from 'src/auth/auth.service';
import { ChangeTestDto } from 'src/test/dto/change-test.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name)
    private readonly testModel: Model<TestDocument>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getTestById(id: string) {
    const test = await this.testModel.findById(id).populate({
      path: 'owner',
      select: '_id first_name',
    });
    if (!test) {
      throw new HttpException(
        'Document (Test) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return test;
  }

  async getTestsIdsWithToken(ids: string[], token) {
    const { _id } = await this.authService.getUserInfo(token);
    const filter = {
      _id: {
        $in: ids.map((id) => new Types.ObjectId(id)),
      },
      owner: _id,
    };
    return this.testModel
      .find({ ...filter })
      .select('_id')
      .exec();
  }
  async getTestWithToken(id: string, token: string) {
    const { _id } = await this.authService.getUserInfo(token);
    const test = await this.getTestById(id);

    if (String(_id) !== String(test.owner._id)) {
      throw new HttpException(
        `You not owner of this test`,
        HttpStatus.FORBIDDEN,
      );
    }

    return test;
  }
  async getTestWithOutRightAnswer(id: string) {
    const test = await this.testModel
      .findById(id)
      .select('-right_answer -right_answers');

    if (!test) {
      throw new HttpException(
        'Document (Test) not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return test;
  }

  async createTest(dto: CreateTestDto, token) {
    const { _id } = await this.authService.getUserInfo(token);

    const test = await this.testModel.create({ ...dto, owner: _id });
    return this.getTestById(test._id);
  }

  async changeTest(id: string, dto: ChangeTestDto, token: string) {
    const test = await this.getTestWithToken(id, token);

    await test.updateOne({ ...dto });
    return this.getTestById(id);
  }

  async removeTest(id: string, token: string) {
    const test = await this.getTestWithToken(id, token);

    const result = await test.remove();
    return result;
  }

  async actionTest(id: string, answer: string) {
    const test = await this.getTestById(id);
    return test.right_answer === answer;
  }
}
