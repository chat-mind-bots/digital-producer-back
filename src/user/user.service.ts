import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { BotService } from 'src/bot/bot.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => BotService))
    private readonly botService: BotService,
  ) {}

  async findByTGId(tg_id: number) {
    const user = await this.userModel.findOne({ tg_id }).lean();
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException(
        'Document (User) not found',
        HttpStatus.NOT_FOUND,
      );
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
    await user.updateOne({ $addToSet: { role: role } });
    await this.botService.sendMessage(
      user.tg_id,
      `Вы были повышены до ${role}. Для  активации изменений подождите 24 часа`,
      false,
    );
    return await this.findById(id);
  }

  async beatUserRole(id: string, role: UserRoleEnum) {
    const user = await this.findById(id);
    await user.updateOne({ $pull: { role: role } });
    await this.botService.sendMessage(
      user.tg_id,
      `Вас понизили. Теперь у вас нет роли ${role}.`,
      false,
    );
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
  async findByUserName(q: string) {
    const user = await this.userModel
      .findOne({ username: q })
      .select('first_name username photos')
      .exec();

    if (!user) {
      throw new HttpException(
        'Document (User) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async updateUser(tg_id: number) {
    const dto: UpdateUserDto = await this.botService.getChatInfo(tg_id);
    await this.userModel.findOneAndUpdate({ tg_id }, { ...dto });
    return this.userModel.findOne({ tg_id });
  }

  async updateAllUsers() {
    const users = await this.userModel.find().select('tg_id');
    for (const user of users) {
      await this.updateUser(user.tg_id);
    }
    return users;
  }
}
