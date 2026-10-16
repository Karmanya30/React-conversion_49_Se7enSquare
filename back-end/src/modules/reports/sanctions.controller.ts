import { Controller, Get } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { db, SanctionRecord } from '../../common/utils/in-memory-db';

@ApiTags('sanctions')
@ApiHeader({
  name: 'x-role',
  required: true,
  description: 'RBAC role header.',
})
@ApiHeader({
  name: 'x-user-id',
  required: true,
  description: 'Numeric user ID of the requesting user.',
})
@Controller('sanctions')
export class SanctionsController {
  @Get('mine')
  @ApiOperation({
    summary: 'Get current user active and historical sanctions',
    description: 'Allows any user (including suspended or banned users) to view sanctions applied to their account.',
  })
  @ApiOkResponse({ description: 'List of sanctions targeting the current user' })
  findMine(@CurrentUser('id') userId: number): SanctionRecord[] {
    if (!userId) return [];
    return db.sanctions.filter((s) => s.targetUserId === Number(userId));
  }
}
