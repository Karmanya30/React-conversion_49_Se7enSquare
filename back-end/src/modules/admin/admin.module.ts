import { Module } from '@nestjs/common';
import { AdminCommunitiesController } from './admin-communities.controller';
import { SanctionsModule } from '../sanctions/sanctions.module';

@Module({
  imports: [SanctionsModule],
  controllers: [AdminCommunitiesController],
})
export class AdminModule {}
