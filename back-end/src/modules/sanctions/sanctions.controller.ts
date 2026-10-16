import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AppRole } from '../rbac/role.enum';
import { SanctionsService } from './sanctions.service';
import { db, SanctionRecord, saveDb } from '../../common/utils/in-memory-db';
import { NotificationsService } from '../notifications/notifications.service';
import { sanitizeUser } from '../../common/utils/sanitize-user';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class SuspendDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}

class BanDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

class ReinstateDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

@ApiTags('sanctions')
@ApiHeader({ name: 'x-role', required: true, description: 'RBAC role header' })
@ApiHeader({ name: 'x-user-id', required: true, description: 'Requesting user ID' })
@Controller('users')
export class SanctionsController {
  constructor(private readonly sanctionsService: SanctionsService) {}

  @Get(':id/sanctions')
  @Roles(AppRole.ADMIN, AppRole.MODERATOR)
  @ApiOperation({ summary: 'List all sanctions for a user (admin/moderator only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Array of SanctionRecord' })
  listForUser(@Param('id', ParseIntPipe) id: number): SanctionRecord[] {
    return this.sanctionsService.listForUser(id);
  }

  @Post(':id/suspend')
  @Roles(AppRole.ADMIN)
  @ApiOperation({ summary: 'Suspend a user (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { example: { reason: 'Violation of community guidelines', endsAt: '2026-11-01T00:00:00Z' } } })
  @ApiCreatedResponse({ description: 'Sanction created, user status set to suspended' })
  suspend(
    @Param('id', ParseIntPipe) targetId: number,
    @CurrentUser('id') adminId: number,
    @CurrentUser('role') adminRole: string,
    @Body() dto: SuspendDto,
  ) {
    if (targetId === adminId) {
      throw new BadRequestException('Cannot suspend your own account');
    }

    const user = db.users.find((u) => u.id === targetId);
    if (!user) throw new NotFoundException(`User ${targetId} not found`);

    if (user.role === AppRole.ADMIN) {
      const activeAdminCount = db.users.filter(
        (u) => u.role === AppRole.ADMIN && u.status === 'active' && u.id !== targetId,
      ).length;
      if (activeAdminCount < 1) {
        throw new BadRequestException('Cannot suspend the last active administrator');
      }
    }

    user.status = 'suspended';
    user.statusReason = dto.reason;
    user.statusUntil = dto.endsAt ?? undefined;
    user.statusBy = adminId;
    saveDb();

    const sanction = this.sanctionsService.create({
      targetUserId: targetId,
      communityId: null,
      type: 'suspend',
      reason: dto.reason,
      byUserId: adminId,
      byRole: adminRole ?? AppRole.ADMIN,
      expiresAt: dto.endsAt ?? null,
    });

    // Suspend communities owned by this user
    const ownedCommunities = db.communities.filter(
      (c) => c.ownerId === targetId && c.status !== 'suspended',
    );
    for (const c of ownedCommunities) {
      c.status = 'suspended';
      c.suspendedReason = `Owner suspended: ${dto.reason}`;
      c.suspendedAt = new Date().toISOString();
      c.suspendedBy = adminId;
      this.sanctionsService.create({
        targetUserId: targetId,
        communityId: c.id,
        type: 'community_suspend',
        reason: `Owner suspended: ${dto.reason}`,
        byUserId: adminId,
        byRole: adminRole ?? AppRole.ADMIN,
      });
    }

    return { user: sanitizeUser(user), sanction };
  }

  @Post(':id/ban')
  @Roles(AppRole.ADMIN)
  @ApiOperation({ summary: 'Ban a user permanently (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { example: { reason: 'Repeated policy violations' } } })
  @ApiCreatedResponse({ description: 'Sanction created, user status set to banned' })
  ban(
    @Param('id', ParseIntPipe) targetId: number,
    @CurrentUser('id') adminId: number,
    @CurrentUser('role') adminRole: string,
    @Body() dto: BanDto,
  ) {
    if (targetId === adminId) {
      throw new BadRequestException('Cannot ban your own account');
    }

    const user = db.users.find((u) => u.id === targetId);
    if (!user) throw new NotFoundException(`User ${targetId} not found`);

    if (user.role === AppRole.ADMIN) {
      const activeAdminCount = db.users.filter(
        (u) => u.role === AppRole.ADMIN && u.status === 'active' && u.id !== targetId,
      ).length;
      if (activeAdminCount < 1) {
        throw new BadRequestException('Cannot ban the last active administrator');
      }
    }

    user.status = 'banned';
    user.statusReason = dto.reason;
    user.statusBy = adminId;
    saveDb();

    const sanction = this.sanctionsService.create({
      targetUserId: targetId,
      communityId: null,
      type: 'ban',
      reason: dto.reason,
      byUserId: adminId,
      byRole: adminRole ?? AppRole.ADMIN,
    });

    // Suspend communities owned by this user
    const ownedCommunities = db.communities.filter(
      (c) => c.ownerId === targetId && c.status !== 'suspended',
    );
    for (const c of ownedCommunities) {
      c.status = 'suspended';
      c.suspendedReason = `Owner banned: ${dto.reason}`;
      c.suspendedAt = new Date().toISOString();
      c.suspendedBy = adminId;
      this.sanctionsService.create({
        targetUserId: targetId,
        communityId: c.id,
        type: 'community_suspend',
        reason: `Owner banned: ${dto.reason}`,
        byUserId: adminId,
        byRole: adminRole ?? AppRole.ADMIN,
      });
    }

    return { user: sanitizeUser(user), sanction };
  }

  @Post(':id/reinstate')
  @Roles(AppRole.ADMIN)
  @ApiOperation({ summary: 'Reinstate a suspended or banned user (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { example: { reason: 'Appeal approved' } } })
  @ApiCreatedResponse({ description: 'User status reset to active, active sanctions reversed' })
  reinstate(
    @Param('id', ParseIntPipe) targetId: number,
    @CurrentUser('id') adminId: number,
    @Body() dto: ReinstateDto,
  ) {
    const user = db.users.find((u) => u.id === targetId);
    if (!user) throw new NotFoundException(`User ${targetId} not found`);

    user.status = 'active';
    user.statusReason = undefined;
    user.statusUntil = undefined;
    user.statusBy = undefined;
    saveDb();

    // Reverse all active platform-wide sanctions for this user
    const now = new Date().toISOString();
    db.sanctions
      .filter(
        (s) =>
          s.targetUserId === targetId &&
          s.status === 'active' &&
          s.communityId === null &&
          (s.type === 'suspend' || s.type === 'ban'),
      )
      .forEach((s) => {
        s.status = 'reversed';
        s.reversedBy = adminId;
        s.reversedAt = now;
      });

    // Reinstate communities that were suspended due to owner restriction
    const ownedSuspendedCommunities = db.communities.filter(
      (c) => c.ownerId === targetId && c.status === 'suspended' && c.suspendedReason?.startsWith('Owner '),
    );
    for (const c of ownedSuspendedCommunities) {
      c.status = 'active';
      c.suspendedReason = undefined;
      c.suspendedAt = undefined;
      c.suspendedBy = undefined;
      db.sanctions
        .filter(
          (s) =>
            s.communityId === c.id &&
            s.type === 'community_suspend' &&
            s.status === 'active',
        )
        .forEach((s) => {
          s.status = 'reversed';
          s.reversedBy = adminId;
          s.reversedAt = now;
        });
    }

    saveDb();

    NotificationsService.push({
      userId: targetId,
      type: 'sanction',
      text: `Your account restriction has been lifted. ${dto.reason}`,
      targetId: targetId,
    });

    return { user: sanitizeUser(user) };
  }
}
