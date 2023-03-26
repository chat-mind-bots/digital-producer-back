import { Injectable } from '@nestjs/common';
import { CurseStatusEnum } from 'src/course/enum/curse-status.enum';
import { enumToObject } from 'src/config/services/enum-to-js';
import { CourseLevelDifficultlyEnum } from 'src/course/enum/course-level-dificultly.enum';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { ProgressStatusEnum } from 'src/test/enum/progress-status.enum';

@Injectable()
export class ConfigService {
  async getConfig() {
    const course_statuses = enumToObject(CurseStatusEnum);
    const levels_difficulty = enumToObject(CourseLevelDifficultlyEnum);
    const user_roles = enumToObject(UserRoleEnum);
    const test_progress_statuses = enumToObject(ProgressStatusEnum);
    const bot_name = process.env.TELEGRAM_API_NAME;
    return {
      course_statuses,
      levels_difficulty,
      user_roles,
      test_progress_statuses,
      bot_name,
    };
  }
}
