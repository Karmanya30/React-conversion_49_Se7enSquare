import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'Sign in with username/email and password' })
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('google')
  @ApiOperation({ summary: 'Sign in or register with verified Google credential' })
  googleAuth(@Body() payload: GoogleAuthDto) {
    return this.authService.googleAuth(payload);
  }
}
