import { Body, Controller, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AppRole } from '../rbac/role.enum';
import { SanctionsService } from '../sanctions/sanctions.service';
import { db, saveDb, nextId } from '../../common/utils/in-memory-db';
import { NotificationsService } from '../notifications/notifications.service';
import { IsNotEmpty, IsString } from 'class-validator';

class CommunitySuspendDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

class CommunityReinstateDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

/**
 * Admin-only community moderation endpoints.
 * Lives in a SEPARATE file so Person B's communities.service.ts is not modified.
 * Directly mutates db.communities[] and db.sanctions[].
 */
@ApiTags('admin-communities')
@ApiHeader({ name: 'x-role', required: true, description: 'RBAC role header' })
@ApiHeader({ name: 'x-user-id', required: true, description: 'Requesting user ID' })
@Controller('admin/communities')
export class AdminCommunitiesController {
  constructor(private readonly sanctionsService: SanctionsService) {}

  @Post(':id/suspend')
  @Roles(AppRole.ADMIN)
  @ApiOperation({ summary: 'Suspend a community (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { example: { reason: 'Repeated policy violations' } } })
  @ApiCreatedResponse({ description: 'Community suspended, sanction written, owner notified' })
  suspend(
    @Param('id', ParseIntPipe) communityId: number,
    @CurrentUser('id') adminId: number,
    @CurrentUser('role') adminRole: string,
    @Body() dto: CommunitySuspendDto,
  ) {
    const community = db.communities.find((c) => c.id === communityId);
    if (!community) throw new NotFoundException(`Community ${communityId} not found`);

    community.status = 'suspended';
    community.suspendedReason = dto.reason;
    community.suspendedAt = new Date().toISOString();
    community.suspendedBy = adminId;
    saveDb();

    // Write a community_suspend sanction (this is the appealable record)
    const sanction = this.sanctionsService.create({
      targetUserId: community.ownerId,
      communityId,
      type: 'community_suspend',
      reason: dto.reason,
      byUserId: adminId,
      byRole: adminRole ?? AppRole.ADMIN,
    });

    // Notify the community owner
    NotificationsService.push({
      userId: community.ownerId,
      type: 'community',
      text: `Your community "${community.name}" has been suspended by an admin: ${dto.reason}`,
      targetId: communityId,
    });

    return { community, sanction };
  }

  @Post(':id/reinstate')
  @Roles(AppRole.ADMIN)
  @ApiOperation({ summary: 'Reinstate a suspended community (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { example: { reason: 'Appeal approved' } } })
  @ApiCreatedResponse({ description: 'Community reinstated, active suspension sanctions reversed' })
  reinstate(
    @Param('id', ParseIntPipe) communityId: number,
    @CurrentUser('id') adminId: number,
    @Body() dto: CommunityReinstateDto,
  ) {
    const community = db.communities.find((c) => c.id === communityId);
    if (!community) throw new NotFoundException(`Community ${communityId} not found`);

    community.status = 'active';
    community.suspendedReason = undefined;
    community.suspendedAt = undefined;
    community.suspendedBy = undefined;

    // Reverse all active community_suspend sanctions for this community
    const now = new Date().toISOString();
    db.sanctions
      .filter(
        (s) =>
          s.communityId === communityId &&
          s.type === 'community_suspend' &&
          s.status === 'active',
      )
      .forEach((s) => {
        s.status = 'reversed';
        s.reversedBy = adminId;
        s.reversedAt = now;
      });

    saveDb();

    // Notify the community owner
    NotificationsService.push({
      userId: community.ownerId,
      type: 'community',
      text: `Your community "${community.name}" has been reinstated. ${dto.reason}`,
      targetId: communityId,
    });

    return { community };
  }
}
