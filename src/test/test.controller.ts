import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TestService } from 'src/test/test.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { Question } from 'src/test/schemas/question.schema';
import { CreateQuestionDto } from 'src/test/dto/create-question.dto';
import { ChangeQuestionDto } from 'src/test/dto/change-question.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { Test } from 'src/test/schemas/test.schema';
import { CreateTestDto } from 'src/test/dto/create-test.dto';
import { ChangeTestDto } from 'src/test/dto/change-test.dto';
import { AddQuestionToTestQueryDto } from 'src/test/dto/query/add-question-to-test-query.dto';

@Controller('test')
@ApiTags('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @ApiOperation({ summary: 'Create Question' })
  @ApiResponse({ status: 201, type: Question })
  @Roles(UserRoleEnum.PRODUCER)
  @Post('question')
  async createQuestion(@Req() req, @Body() dto: CreateQuestionDto) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.createQuestion(dto, token);
  }

  @ApiOperation({ summary: 'Get Question for user' })
  @ApiResponse({ status: 200, type: Question })
  @Roles(UserRoleEnum.USER)
  @UsePipes(MongoIdPipe)
  @Get('question/:id/for-user')
  async getQuestionForUser(@Param('id') id: string) {
    return this.testService.getQuestionWithOutRightAnswer(id);
  }

  @ApiOperation({ summary: 'Get Question for owner' })
  @ApiResponse({ status: 200, type: Question })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Get('question/:id')
  async getQuestion(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.getQuestionWithToken(id, token);
  }

  @ApiOperation({ summary: 'Change Question' })
  @ApiResponse({ status: 200, type: Question })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch('question/:id')
  async changeQuestion(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: ChangeQuestionDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.changeQuestion(id, dto, token);
  }

  @ApiOperation({ summary: 'Remove Question' })
  @ApiResponse({ status: 200, type: Question })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Delete('question/:id')
  async removeQuestion(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.removeQuestion(id, token);
  }

  @ApiOperation({ summary: 'Create Test' })
  @ApiResponse({ status: 201, type: Test })
  @Roles(UserRoleEnum.PRODUCER)
  @Post()
  async createTest(@Req() req, @Body() dto: CreateTestDto) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.createTest(dto, token);
  }

  @ApiOperation({ summary: 'Change Test' })
  @ApiResponse({ status: 200, type: Test })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch(':id')
  async changeTest(
    @Req() req,
    @Body() dto: ChangeTestDto,
    @Param('id') id: string,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.changeTest(id, dto, token);
  }

  @ApiOperation({ summary: 'Get Test for user' })
  @ApiResponse({ status: 200, type: Test })
  @Roles(UserRoleEnum.USER)
  @UsePipes(MongoIdPipe)
  @Get(':id/for-user')
  async getTestForUser(@Param('id') id: string) {
    return this.testService.getTestByIdForUser(id);
  }

  @ApiOperation({ summary: 'Get Test for producer' })
  @ApiResponse({ status: 200, type: Test })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Get(':id')
  async getTest(@Req() req, @Param('id') id: string) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.getTestByIdWithTokenCheck(id, token);
  }

  @ApiOperation({ summary: 'Add Questions to Test' })
  @ApiResponse({ status: 200, type: Test })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Post(':id/question')
  async addQuestionToTest(
    @Req() req,
    @Param('id') id: string,
    @Query() query: AddQuestionToTestQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.addQuestionToTest(id, query, token);
  }

  @ApiOperation({ summary: 'Remove Questions from Test' })
  @ApiResponse({ status: 200, type: Test })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Delete(':id/question')
  async removeQuestionFromTest(
    @Req() req,
    @Param('id') id: string,
    @Query() query: AddQuestionToTestQueryDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.testService.removeQuestionFromTest(id, query, token);
  }
}
