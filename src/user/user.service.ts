import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByTGId(tg_id: number) {
    const user = await this.userModel.findOne({ tg_id });
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const oldUser = await this.findByTGId(dto.tg_id);
    if (oldUser) {
      return oldUser;
    }
    const user = await this.userModel.create(dto);
    return user;
  }

  async updateUserRole(id: string, role: UserRoleEnum) {
    const user = await this.findById(id);
    await user.update({ role: [...user.role, role] });
    return await this.findById(id);
  }

  async findAll(limit: number, offset: number, q: string) {
    const searchQuery = {};
    if (q) {
      searchQuery['$or'] = [
        { username: { $regex: q, $options: 'i' } },
        { first_name: { $regex: q, $options: 'i' } },
      ];
    }
    console.log(q);
    console.log(searchQuery);
    const users = await this.userModel
      .find({ ...searchQuery })
      .limit(limit)
      .skip(offset);
    const total = await this.userModel
      .countDocuments({ ...searchQuery })
      .exec();

    return {
      data: users,
      total,
    };
  }
}
