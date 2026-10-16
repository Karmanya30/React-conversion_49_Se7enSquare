import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiPropertyOptional({
    description: 'Google ID Token (credential JWT) returned by Google Identity Services',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...',
  })
  @IsOptional()
  @IsString()
  credential?: string;

  @ApiPropertyOptional({
    description: 'Google OAuth2 access token returned by Google OAuth2 token client',
    example: 'ya29.a0AfH6SMC...',
  })
  @IsOptional()
  @IsString()
  accessToken?: string;
}
