import { Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';
import { RequestArrayType } from './types/request-array.type';
import { UserGetQueryDto } from 'src/user/dto/query/user-get-query.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Update user role to producer' })
  @ApiResponse({ status: 200, type: User })
  @Roles(UserRoleEnum.ADMIN)
  @UsePipes(MongoIdPipe)
  @Post('/upgrade-to-producer/:id')
  async updateToProducer(@Param('id') id: string) {
    return this.userService.updateUserRole(id, UserRoleEnum.PRODUCER);
  }

  @ApiOperation({ summary: 'Update user role to admin' })
  @ApiResponse({ status: 200, type: User })
  @Roles(UserRoleEnum.SUPER_ADMIN)
  @UsePipes(MongoIdPipe)
  @Post('/upgrade-to-admin/:id')
  async updateToAdmin(@Param('id') id: string) {
    return this.userService.updateUserRole(id, UserRoleEnum.ADMIN);
  }

  @ApiOperation({ summary: 'Beat user role from super admin  to admin' })
  @ApiResponse({ status: 200, type: User })
  @Roles(UserRoleEnum.SUPER_ADMIN)
  @UsePipes(MongoIdPipe)
  @Post('/beat-from-super-admin/:id')
  async beatFromSuperAdmin(@Param('id') id: string) {
    return this.userService.beatUserRole(id, UserRoleEnum.SUPER_ADMIN);
  }

  @ApiOperation({ summary: 'Beat user role from producer to user' })
  @ApiResponse({ status: 200, type: User })
  @Roles(UserRoleEnum.ADMIN)
  @UsePipes(MongoIdPipe)
  @Post('/beat-from-producer/:id')
  async beatFromProducer(@Param('id') id: string) {
    return this.userService.beatUserRole(id, UserRoleEnum.PRODUCER);
  }

  @ApiOperation({ summary: 'Beat user role from admin to producer' })
  @ApiResponse({ status: 200, type: User })
  @Roles(UserRoleEnum.SUPER_ADMIN)
  @UsePipes(MongoIdPipe)
  @Post('/beat-from-admin/:id')
  async beatFromAdmin(@Param('id') id: string) {
    return this.userService.beatUserRole(id, UserRoleEnum.ADMIN);
  }

  @ApiOperation({ summary: 'Update user role to super admin' })
  @ApiResponse({ status: 200, type: User })
  @Roles(UserRoleEnum.SUPER_ADMIN)
  @UsePipes(MongoIdPipe)
  @Post('/upgrade-to-super-admin/:id')
  async updateToSuperAdmin(@Param('id') id: string) {
    return this.userService.updateUserRole(id, UserRoleEnum.SUPER_ADMIN);
  }

  @ApiOperation({ summary: 'Get users list' })
  @ApiResponse({ status: 200, type: RequestArrayType })
  @Roles(UserRoleEnum.PRODUCER)
  @Get()
  async getUsers(@Query() query: UserGetQueryDto) {
    const { q, offset, limit } = query;
    return this.userService.findAll(limit, offset, q);
  }
}
