import { IsIn, IsOptional, IsString, Length } from 'class-validator';
export class UpdateOrganiserStatusDto {
  @IsIn(['verified', 'rejected'])
  status!: 'verified' | 'rejected';
  @IsOptional() @IsString() @Length(5, 500)
  rejectionReason?: string;
}
