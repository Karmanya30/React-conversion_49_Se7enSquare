import { Module } from '@nestjs/common';
import { SanctionsService } from './sanctions.service';
import { SanctionsController } from './sanctions.controller';
import { SanctionsMineController } from './sanctions-mine.controller';

@Module({
  controllers: [SanctionsController, SanctionsMineController],
  providers: [SanctionsService],
  exports: [SanctionsService],
})
export class SanctionsModule {}
