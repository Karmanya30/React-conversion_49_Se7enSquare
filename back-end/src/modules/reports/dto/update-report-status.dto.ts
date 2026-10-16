import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from './report.dto';

export class UpdateReportStatusDto {
  @ApiProperty({ enum: ReportStatus, example: ReportStatus.REVIEWED })
  @IsEnum(ReportStatus)
  status!: ReportStatus;

  @ApiProperty({ required: false, example: 'Resolved: Violation confirmed' })
  @IsOptional()
  @IsString()
  resolutionNote?: string;
}
