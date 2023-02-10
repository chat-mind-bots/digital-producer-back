import { Controller, Param, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';

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

  @ApiOperation({ summary: 'Update user role to super admin' })
  @ApiResponse({ status: 200, type: User })
  @Roles(UserRoleEnum.SUPER_ADMIN)
  @UsePipes(MongoIdPipe)
  @Post('/upgrade-to-super-admin/:id')
  async updateToSuperAdmin(@Param('id') id: string) {
    return this.userService.updateUserRole(id, UserRoleEnum.SUPER_ADMIN);
  }
}
