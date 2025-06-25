import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
