import {
  Body,
  Controller,
  Get,
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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AppRole } from '../rbac/role.enum';
import { SanctionsService } from './sanctions.service';
import { SanctionType } from '../../common/utils/in-memory-db';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

class CreateSanctionDto {
  @IsNumber()
  targetUserId!: number;

  @IsOptional()
  @IsNumber()
  communityId?: number | null;

  @IsString()
  @IsNotEmpty()
  type!: SanctionType;

  @IsString()
  @IsNotEmpty()
  reason!: string;

  @IsOptional()
  @IsNumber()
  reportId?: number | null;

  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;
}

@ApiTags('sanctions')
@ApiHeader({ name: 'x-role', required: true, description: 'RBAC role header' })
@ApiHeader({ name: 'x-user-id', required: true, description: 'Requesting user ID' })
@Controller('sanctions')
export class SanctionsMineController {
  constructor(private readonly sanctionsService: SanctionsService) {}

  @Get('mine')
  @ApiOperation({
    summary: 'Get current user sanctions (including suspended/banned users)',
    description: 'Whitelisted by AuthContextGuard — accessible even when account is restricted.',
  })
  @ApiOkResponse({ description: 'Array of SanctionRecord for the current user' })
  findMine(@CurrentUser('id') userId: number) {
    if (!userId) return [];
    return this.sanctionsService.listForUser(userId);
  }

  @Post()
  @Roles(AppRole.ADMIN, AppRole.MODERATOR)
  @ApiOperation({ summary: 'Create a sanction (admin or moderator)' })
  @ApiCreatedResponse({ description: 'Sanction record created' })
  create(
    @CurrentUser('id') adminId: number,
    @CurrentUser('role') adminRole: string,
    @Body() dto: CreateSanctionDto,
  ) {
    return this.sanctionsService.create({
      targetUserId: dto.targetUserId,
      communityId: dto.communityId ?? null,
      type: dto.type,
      reason: dto.reason,
      byUserId: adminId,
      byRole: adminRole ?? AppRole.ADMIN,
      reportId: dto.reportId ?? null,
      expiresAt: dto.expiresAt ?? null,
    });
  }

  @Post(':id/reverse')
  @Roles(AppRole.ADMIN)
  @ApiOperation({ summary: 'Reverse an active sanction (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  reverse(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') adminId: number,
  ) {
    return this.sanctionsService.reverse(id, adminId);
  }
}
