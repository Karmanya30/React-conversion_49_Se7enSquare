import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { SanctionsController } from './sanctions.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController, SanctionsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}

