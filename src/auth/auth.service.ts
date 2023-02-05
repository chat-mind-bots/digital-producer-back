import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(id: number) {
    const user = await this.userService.findByTGId(id);
    if (user) {
      const result = user;
      return result;
    }
    return null;
  }

  async login(first_name: string, tg_id: number) {
    const payload = { username: first_name, sub: tg_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserInfo(token: string) {
    const { sub } = await this.jwtService.decode(token);
    const user = await this.userService.findByTGId(sub);
    return user;
  }
}
