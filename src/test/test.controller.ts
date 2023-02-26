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
import { Question } from 'src/test/schemas/question.schema';
import { CreateQuestionDto } from 'src/test/dto/create-question.dto';
import { ChangeQuestionDto } from 'src/test/dto/change-question.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';

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
}
