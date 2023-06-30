import { Body, Controller, Post } from '@nestjs/common';
import { TaskService } from 'src/task/task.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public-route.decorator';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // @ApiOperation({ summary: 'Handle' })
  // @Public()
  // @Post()
  // async handleArray() {
  //   const array = [1, 2, 3];
  //   // Call the handleArray method of the ArrayService
  //   await this.taskService.handleArray(array);
  // }
}
