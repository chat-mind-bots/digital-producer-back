import { Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.schema';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Get user info method' })
  @ApiResponse({ status: 200, type: User })
  @Post('')
  tokenChecker(@Req() req) {
    const bearer = req.headers.authorization;
    return this.authService.getUserInfo(bearer.split('Bearer ')[1]);
  }
}
