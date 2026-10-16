import { IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  current?: string;

  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[\s\S]+$/, { message: 'new password must contain a letter and a number' })
  new!: string;

  @IsString()
  @MaxLength(128)
  confirm!: string;
}
