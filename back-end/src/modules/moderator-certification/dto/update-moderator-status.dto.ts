import { IsIn, IsOptional, IsString, Length } from 'class-validator';
export class UpdateModeratorStatusDto {
  @IsIn(['certified', 'rejected'])
  status!: 'certified' | 'rejected';
  @IsOptional() @IsString() @Length(5, 500)
  rejectionReason?: string;
}
