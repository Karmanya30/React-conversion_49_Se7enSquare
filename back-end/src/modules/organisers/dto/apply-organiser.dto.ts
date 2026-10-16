import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString, Length, Min, Max, IsArray, ArrayMaxSize, IsUrl, Equals } from 'class-validator';
export class ApplyOrganiserDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) userId?: number;
  @IsString() @Length(20, 1000) experienceNote!: string;
  @IsString() @Length(2, 500) games!: string;
  @IsString() @Length(2, 500) organisations!: string;
  @IsArray() @ArrayMaxSize(10) @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { each: true }) pastEventLinks!: string[];
  @Type(() => Number) @IsInt() @Min(2) @Max(100000) expectedTournamentSize!: number;
  @Equals(true, { message: 'rulesAgreement: you must agree to the tournament rules' }) rulesAgreement!: boolean;
}
