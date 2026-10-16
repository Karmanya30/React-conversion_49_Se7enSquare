import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

// NOTE: SanctionsController has been moved to SanctionsModule (src/modules/sanctions/).
// The old stub controller (reports/sanctions.controller.ts) is superseded.

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}

