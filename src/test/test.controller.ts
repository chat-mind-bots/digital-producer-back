import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TestService } from 'src/test/test.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { Test } from 'src/test/test.schema';
import { CreateTestDto } from 'src/test/dto/create-test.dto';
import { ChangeTestDto } from 'src/test/dto/change-test.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';

@Controller('test')
@ApiTags('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @ApiOperation({ summary: 'Create test' })
  @ApiResponse({ status: 201, type: Test })
  @Roles(UserRoleEnum.PRODUCER)
  @Post()
  async createTest(@Req() req, @Body() dto: CreateTestDto) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.createTest(dto, token);
  }

  @ApiOperation({ summary: 'Get test for user' })
  @ApiResponse({ status: 200, type: Test })
  @Roles(UserRoleEnum.USER)
  @UsePipes(MongoIdPipe)
  @Get('/:id/for-user')
  async getTestForUser(@Param('id') id: string) {
    return this.testService.getTestWithOutRightAnswer(id);
  }

  @ApiOperation({ summary: 'Get test for owner' })
  @ApiResponse({ status: 200, type: Test })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Get('/:id')
  async getTest(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.getTestWithToken(id, token);
  }

  @ApiOperation({ summary: 'Change test' })
  @ApiResponse({ status: 200, type: Test })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch('/:id')
  async changeTest(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: ChangeTestDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.changeTest(id, dto, token);
  }

  @ApiOperation({ summary: 'Remove test' })
  @ApiResponse({ status: 200, type: Test })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Delete('/:id')
  async removeTest(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.removeTest(id, token);
  }
}
