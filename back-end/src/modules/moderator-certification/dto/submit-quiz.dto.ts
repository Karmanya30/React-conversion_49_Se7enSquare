import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Length, Min, Max, ValidateNested } from 'class-validator';
export class ModeratorStatementDto {
  @IsString() @Length(20, 1000) why!: string;
  @IsString() @Length(2, 80) timeZone!: string;
  @Type(() => Number) @IsInt() @Min(1) @Max(168) weeklyHours!: number;
}
export class SubmitQuizDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) userId?: number;
  @IsArray() @ArrayMinSize(1) @IsInt({ each: true }) @Min(0, { each: true }) answers!: number[];
  @ValidateNested() @Type(() => ModeratorStatementDto) statement!: ModeratorStatementDto;
}
